function errHandler(err, req, res, next){
    if(err.name === 'SequelizeValidationError'){
        let errors = err.errors.map(e => {
            return e.message;
        })
        res.status(400).json({message: errors});
    } else if (err.code === 400 || err.code === 404 || err.code === 401){
        res.status(err.code).json({message: err.message})
    } else {
        res.status(500).json({message: 'failed reach server to read data'})
    }
}

module.exports = errHandler