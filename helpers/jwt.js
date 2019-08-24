const jwt = require('jsonwebtoken')


module.exports = {
  getToken = async (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET )
  },
  verifyToken = async (token) => {
    return jwt.verify(token, process.env.JWT_SECRET)
  }
}