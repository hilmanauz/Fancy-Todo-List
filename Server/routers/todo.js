const router = require('express').Router();
const Controller = require('../controllers');
const authorize = require('../middlewares/authorize');


router.get('/', Controller.viewTodo);

router.post('/', Controller.createTodo);

router.use('/:id', authorize);

router.get('/:id', Controller.getIdTodo);

router.put('/:id', Controller.updateToDo);

router.patch('/:id', Controller.updateStatus);

router.delete('/:id', Controller.deleteTodo);

module.exports = router