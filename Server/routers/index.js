const router = require('express').Router();
const routerTodo = require('./todo');
const Controller = require('../controllers');
const authenticate = require('../middlewares/authenticate')

router.post('/register', Controller.register);

router.post('/login', Controller.login);

router.post('/googleLogin', Controller.googleLogin)

router.post('/weather', Controller.weather);

router.use(authenticate);

router.use('/todos', routerTodo);

module.exports = router