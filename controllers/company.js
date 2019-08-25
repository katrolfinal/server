const Company = require('../models/companies')
const { comparePassword } = require('../helpers/bcrypt')
const { getToken } = require('../helpers/jwt')

class CompanyController {
  
  static async findAll(req, res, next) {
    try {
      const companies = await Company.find()
      res.status(200).json(companies)
    } catch (error) {
      next(error)
    }
  }

  static async login (req, res, next) {
    try {
      const { email, password } = req.body
      const company = await Company.findOne({email})
      if(company && comparePassword(company.password, password)) {
        delete company.password
        const token = getToken({ company })
        res.status(200).json({token, company})
      } else throw { status: 404, message : 'Wrong email / password'}
    } catch (error) {
      next(error)
    }
  }

  static async create (req, res, next) {
    try {
      console.log('masuk')
      console.log('req.body: ', req.body);
      const { email, name, password } = req.body
      const input = { email, name, password }
      if(req.file && req.file.gcsUrl) { 
        input.logo = req.file.gcsUrl
      } 
      const result = await Company.create(input)
      res.status(201).json(result)
    } catch (error) {
      // console.log('error: ', error);
      next(error)
    }
  }
}

module.exports = CompanyController