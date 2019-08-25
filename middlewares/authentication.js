const Employee = require('../models/employees')
const Company = require('../models/companies')
const { verifyToken } = require('../helpers/jwt')


module.exports = {
  authEmployee : async (req, res, next) => {
    try {
      if(req.headers.hasOwnProperty('token')) {
        const decoded = verifyToken(req.headers.token)
        const employee = Employee.findById(decoded._id)
        if(employee) {
          req.employee = employee
          next()
        } else throw {}
      } else throw {}
    } catch (error) {
      next({status : 400, message : 'you must login first'})
    }
  },
  authCompany : async (req, res, next) => {
    try {
      if(req.headers.hasOwnProperty('token')) {
        const decoded = verifyToken(req.headers.token)
        const company = Company.findById(decoded._id)
        if(company) {
          req.company = company
          next()
        } else throw {}
      } else throw {}
    } catch (error) {
      next({status : 400, message : 'you must login first'})
    }
  }
}