const Employee = require('../models/employees')
const Company = require('../models/companies')
const { verifyToken } = require('../helpers/jwt')


module.exports = {
  authEmployee : async (req, res, next) => {
    try {
      /* istanbul ignore else */
      if(req.headers.hasOwnProperty('token')) {
        const {employee} = verifyToken(req.headers.token)
        const check = await Employee.findById(employee._id)
        /* istanbul ignore else */
        if(check) {
          req.employee = employee
          next()
        } else throw {}
      } else throw {}
    } catch ( /* istanbul ignore next */ error) {
      /* istanbul ignore next */
      next({status : 400, message : 'you must login first'})
    }
  },
  authCompany : async (req, res, next) => {
    try {
      if(req.headers.hasOwnProperty('token')) {
        const {company} = verifyToken(req.headers.token)
        const check = await Company.findById(company._id)
        /* istanbul ignore else */
        if(check) {
          req.company = company
          next()
        } else throw {}
      } else throw {}
    } catch (/* istanbul ignore next */ error) {
      next({status : 400, message : 'you must login first'})
    }
  }
}