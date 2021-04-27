const {Todo} = require('../models');
const authorize = (req, res, next) =>{
    Todo.findByPk(+req.params.id)
        .then(todo => {
            const isTodoUser = todo.UserId === req.currentUser.id
            if(isTodoUser){
                next();
            } else {
                res.status(401).json({message: 'This Todo is Not Yours'});
            }
        })
        .catch(err => {
            res.status(500).json({message: 'Resource Not Found'});
        })
}

module.exports = authorize