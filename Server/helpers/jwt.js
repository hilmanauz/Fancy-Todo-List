const jwt = require('jsonwebtoken')
const access_token = obj => {
    return jwt.sign(obj, process.env.SECRET_KEY);
}
const verify_token = token => {
    return jwt.verify(token, process.env.SECRET_KEY);
}

module.exports = {access_token, verify_token};