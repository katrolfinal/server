const Company = require('../models/companies')
const { comparePassword } = require('../helpers/bcrypt')
const { getToken } = require('../helpers/jwt')
const client = require('redis').createClient()
client.on('error', (err) => {
  /* istanbul ignore next */
  console.log("Error " + err);
});


class CompanyController {
  
  static async findAll(req, res, next) {
    client.get('companies', async (err, result) => {
      if(err) {
        /* istanbul ignore next */
        next(err)
      } else {
        if(result) {
          res.status(200).json(JSON.parse(result))
        } else {
          try {
            /* istanbul ignore next */
            const companies = await Company.find()
            client.setex('companies', 60 * 60, JSON.stringify(companies))
            res.status(200).json(companies)
          } catch (error) {
            /* istanbul ignore next */
            next(error)
          }
        }
      }
    })
  }

  static async login (req, res, next) {
    try {
      const { email, password } = req.body
      const company = await Company.findOne({email})
      if(company && comparePassword(company.password, password)) {
        const token = getToken({company})
        res.status(200).json({token, company})
      } else throw { status: 404, message : 'Wrong email / password'}
    } catch (error) {
      next(error)
    }
  }

  static async create (req, res, next) {
    try {
      const { email, username, password, color, name } = req.body
      
      const input = { email, username, password, color, name }
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

  static async update (req, res, next) {
    try {
      const { email, username, password, color } = req.body
      const input = { email, username, password, color }
      const result = await Company.updateOne({_id: req.company._id}, input)
      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = CompanyController