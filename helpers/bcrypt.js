const bcrypt = require('bcryptjs')

module.exports = {
  hashPassword(input) {
    let salt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(input, salt)
  },
  comparePassword(password, inputPassword) {
    return bcrypt.compareSync(inputPassword, password)
  }
}