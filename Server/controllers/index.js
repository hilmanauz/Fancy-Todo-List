const {Todo, User} = require('../models');
const {comparePassword} = require('../helpers/hash-password');
const {access_token} = require('../helpers/jwt');
const axios = require('axios');
const {OAuth2Client} = require('google-auth-library')

class Controller{
    static createTodo(req, res, next){
        const todoData = {
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            due_date: req.body.due_date,
            UserId: req.currentUser.id,
            status: "unfinished"
        }
        Todo.create(todoData)
        .then(todo => {
            res.status(201).json({message: 'user created', todo});
        })
        .catch(err =>{
            next(err)
        })
    }

    static viewTodo(req, res, next){
        Todo.findAll({where: {UserId: req.currentUser.id}})
            .then(todos => {
                res.status(200).json(todos);
            })
            .catch(err =>{
                next({
                    code: 500,
                    message: 'failed reach server to create data'
                })
            })
    }

    // static viewTodoUser(req, res, next){
    //     User.findByPk(req.currentUser.id, {include: Todo})
    //         .then(userdata => {
    //             let todos = userdata.Todos;
    //             res.status(200).json(todos);
    //         })
    //         .catch(err =>{
    //             next({
    //                 code: 500,
    //                 message: 'failed reach server to create data'
    //             })
    //         })
    // }

    static weather(req, res, next){
        const lat = req.body.lat;
        const lon = req.body.lon;
        console.log(lat, lon);
        axios({
            url: `http://api.weatherstack.com/current?access_key=${process.env.API_WEATHER_KEY}&query=${lat},${lon}`,
            method: 'GET'
        })
            .then(weathers => {
                res.status(200).json(weathers.data);
            })
            .catch(err => {
                next({
                    code: 500,
                    message: 'failed reach server to create data'
                })
            })
    }

    static getIdTodo(req, res, next){
        Todo.findByPk(req.params.id)
        .then(todo=>{
            res.status(200).json(todo);
        })
        .catch(err=>{
            next({
                code: 404,
                message: 'Request object not Found'
            })
        })
    }

    static updateToDo(req, res, next){
        const dataTodo = {
            title: req.body.title,
            description: req.body.description,
            due_date: req.body.due_date
        }
        Todo.update(dataTodo, {where: {id: +req.params.id}, returning: true})
        .then(todo => {
            if(todo[0] === 1 ){
                res.status(200).json({message: 'updated', todo: todo[1]});
            } else {
                next({
                    code: 404,
                    message: 'Request object not Found'
                })
            }
        })
        .catch(err => {
            next(err)
        })
    }

    static updateStatus(req, res, next){
        const updated = {
            status: req.body.status
        }
        Todo.update(updated, {where: {id: +req.params.id}, returning: true})
        .then(todo => {
            if(todo[0] === 1 ){
                res.status(200).json({message: 'updated', todo: todo[1]});
            } else {
                next({
                    code: 404,
                    message: 'Request object not Found'
                })
            }
        })
        .catch(err => {
            next(err)
        })
    }

    static deleteTodo(req, res, next){
        Todo.destroy({where: {id: +req.params.id}})
        .then(data => {
            if(data === 1){
                res.status(200).json({message: 'Todo success to delete'});
            } else {
                res.status(404).json({message:'Request not found'});
            }
        })
        .catch(err => {
            next({
                code: 500
            })
        })
    }

    static register(req, res, next){
        const data = {
            email: req.body.email,
            password: req.body.password
        }
        User.create(data)
            .then(user => {
                res.status(201).json({message: 'Succes create user', user});
            })
            .catch(err => {
                next(err)
            })
    }

    static login(req, res, next){
            let email = req.body.email;
            let password = req.body.password;
            let isUser;
            User.findOne({where: {email}})
            .then(user => {
                if (user){
                    isUser = comparePassword(password, user.password);
                    if (isUser){
                        const accessToken = access_token({id: user.id, email:user.email});
                        res.status(200).json({message: 'success login', accessToken, id:user.id, email: user.email,});
                    } else {
                        next({
                            code: 401,
                            message: 'invalid username or password'
                        });
                    }
                } else {
                    next({
                        code: 401,
                        message: 'invalid username or password'
                    });
                }
            })
            .catch(err => {
                next(err)
            })
    }


    static googleLogin(req, res, next) {
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        async function verify(){
            const ticket = await client.verifyIdToken({
                idToken: req.body.access_token,
                audience: process.env.GOOGLE_CLIENT_ID
            })
            const googleUserParams = ticket.getPayload()
            User.findOrCreate({
                where: {
                    email: googleUserParams.email
                },
                defaults: {
                    password: (new Date()).toDateString()
                }
            })
            .then(user => {
                let data = user[0];
                let payload = {id: data.id, email: data.email}
                res.status(200).json({
                    id: payload.id,
                    email: payload.email,
                    access_token: access_token(payload),
                    message: 'success login'
                })
            })
        }
        verify().catch(console.error)
    }

}


module.exports = Controller