const Company = require('../models/companies')

class CompanyController {
  static async findAll(req, res, next) {
    try {
      const companies = await Company.find()
      res.status(200).json(companies)
    } catch (error) {
      next(error)
    }
  }

  static async create (req, res, next) {
    try {
      const { name, username, email } = req.body
      const input = { name, username, email}
      const result = await Company.create(input)
      res.status(201).json(result)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = CompanyController