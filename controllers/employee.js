const Employee = require('../models/employees')
const convertExcel = require('../helpers/convertExcel')
const getPassword = require('generate-password')
const { getToken } = require('../helpers/jwt')
const path = require('path')
const fs = require('fs')
global.__basedir = __dirname;
const client = require('redis').createClient()
client.on('error', (err) => {
  /* istanbul ignore next */
  console.log("Error " + err);
});

class EmployeeController {
  static async findALl(req, res, next) {
    try {
      const employees = await Employee.find()
      res.status(200).json(employees)
    } catch (error) {
      /* istanbul ignore next */
      next(error)
    }
  }

  static async findById(req, res, next) {
    try {
      const employee = await Employee.find()
      res.status(200).json(employee)
    } catch (error) {
      /* istanbul ignore next */
      next(error)
    }
  }

  static async findByCompany(req, res, next) {
    client.get('forCompany', async (err, result) => {
      if(err) /* istanbul ignore next */ return next(err)
      else {
        /* istanbul ignore if */
        /* istanbul ignore else */
        if(result && req.path === '/forCompany/') /* istanbul ignore next */ res.status(200).json(JSON.parse(result))
        else {
          try {
            const employees = await Employee.find({company : req.employee ? req.employee.company : req.company._id})
            if(req.path === '/forCompany/') client.setex('forCompany', 60 * 60, JSON.stringify(employees))
            res.status(200).json(employees)
          } catch (error) {
            next(error)
          }
        }
      }
    })
  }

  static async bulkInsert(req, res, next) {
    try {
      if(req.file) {
        const filePath = path.join(__dirname, `../excelTmp/${req.file.filename}`)
        const { Sheet1 } = convertExcel(filePath)
        fs.unlinkSync(filePath)
        const arr = []
        Sheet1.forEach(emp => { 
          emp.company = req.company._id 
          emp.password = getPassword.generate({
            length: 8,
            numbers: true
          })
          arr.push(Employee.create(emp))
        })
        const result = await Promise.all(arr)
        res.status(201).json(result)
      } else throw {status : 400, message : 'No file'}
    } catch (error) {
      next(error)
    }
  }

  static async createOne (req, res, next) {
    try {
      const { name, address, phone, email, position } = req.body
      const input = { name, address, phone, email, position }
      input.password = getPassword.generate({
        length: 8,
        numbers: true
      })
      input.company = req.company._id
      const result = await Employee.create(input)
      res.status(201).json(result)
    } catch (error) {
      next(error)
    }
  }

  static async update(req, res, next) {
    try {
      const employee = await Employee.findById(req.params.employeeId)
      if(employee) {
        const { name, address, phone, email, position } = req.body
        const input = { name, address, phone, email, position }
        const update = await Employee.updateOne({_id: req.params.employeeId}, input)
        res.status(200).json(update)
      } else throw {status : 404, resource : 'employee'}
    } catch (error) {
      next(error)
    }
  }

  static async delete(req, res, next) {
    try {
      const employee = await Employee.findById(req.params.employeeId)
      if(employee) {
        const result = await Employee.deleteOne({ _id : req.params.employeeId})
        res.status(200).json(result)
      } else throw { status : 404, resource : 'employee'}
    } catch (error) {
      next(error)
    }
  }

  static async addContact(req, res, next ) {
    try {
      const employee = await Employee.findById(req.employee._id)
      const newEmployee = await Employee.findById(req.params.employeeId)
      if(newEmployee) {
        employee.contacts.push(req.params.employeeId)
        const result = await employee.save()
        res.status(200).json( result )
      } else throw { status : 404, resource : 'employee'}
    } catch (error) {
      next(error)
    }
  }

  static async deleteContact(req, res, next) {
    try {
      const employee = await Employee.findById(req.employee._id)
      /* istanbul ignore else */
      if(employee) {
        const index = employee.contacts.indexOf(req.params.employeeId)
        if(index > -1) {
          employee.contacts.splice(index, 1)
          const result = await employee.save()
          res.status(200).json(result)
        } else throw { status : 404, resource : 'employee'} 
      } else throw { status : 404, resource : 'employee'}
    } catch (error) {
      next(error)
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body
      const employee = await Employee.findOne({email, password}).populate('contacts').populate('company')
      if(employee) {
        delete employee.password
        
        const token = getToken({employee})
        res.status(200).json({token, employee})
      } else throw { status : 400, message: 'wrong email / password'}
    } catch (error) {
      next(error)
    }
  }

  static async uploadImage(req, res, next) {
    try {
      const { gcsUrl } = req.file
      const employee = await Employee.findByIdAndUpdate(req.employee._id, { image : gcsUrl }, {new : true})
      res.status(200).json(employee)
    } catch (error) {
      /* istanbul ignore next */
      next(error)
    }
  }
}

module.exports = EmployeeController