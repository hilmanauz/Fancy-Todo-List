const {verify_token} = require('../helpers/jwt');
const {User} = require('../models')
const authenticate = (req, res, next) => {
    try {
        let {id, email} = verify_token(req.headers.access_token);
        User.findOne({where: {id, email}})
        .then(user => {
            req.currentUser = {id: user.id, email: user.email};
            next();
        })
        .catch(err => {
            throw new Error();
        })
    } catch (error){
        res.status(401).json({message: 'unauthorized'});
    }
}

module.exports = authenticate