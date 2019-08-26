const Employee = require('../models/employees')
const convertExcel = require('../helpers/convertExcel')
const getPassword = require('generate-password')
const { getToken } = require('../helpers/jwt')
const fs = require('fs')
global.__basedir = __dirname;

class EmployeeController {
  
  static async findALl(req, res, next) {
    try {
      const employees = await Employee.find()
      res.status(200).json(employees)
    } catch (error) {
      next(error)
    }
  }

  static async findById(req, res, next) {
    try {
      const employee = await Employee.findById(req.employee._id)
                              .populate('contacts')
                              .populate('company')
      if(employee) {
        res.status(200).json(employee)
      } else throw { status: 404, resource: 'employee'}
    } catch (error) {
      next(error)
    }
  }

  static async findByCompany(req, res, next) {
    try {
      const employees = await Employee.find({company : req.params.companyId})
      res.status(200).json(employees)
    } catch (error) {
      next(error)
    }
  }

  static async bulkInsert(req, res, next) {
    try {
      if(req.file) {
        const filePath = '/Users/jays/hacktiv/pinal_projec/server/excelTmp/' + req.file.filename
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
        console.log(employee, 'dari databasenay')
        const { name, address, phone, email, position } = req.body
        const input = { name, address, phone, email, position }
        console.log(input, 'input <<<<<<')
        const update = await Employee.updateOne({_id: req.params.employeeId}, input)
        console.log(update)
        res.status(200).json(update)
      } else throw {status : 404, resource : 'Employee'}
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
      const { contact } = req.body
      const newEmployee = await Employee.findById(contact)
      if(newEmployee) {
        const employee = await Employee.findById(req.params.employeeId)
        if(employee) {
          employee.push(contacts)
          const result = await employee.save()
          res.status(200).json( result )
        } else throw { status : 404, resource : 'employee'}
      } else throw { status: 400, message : 'Employee required'} 
    } catch (error) {
      next(error)
    }
  }

  static async deleteContact(req, res, next) {
    try {
      const employee = Employee.findById(req.user._id)
      if(employee) {
        const index = employee.contacts.indexOf(req.params.contactId)
        employee.contacts.splice(index, 1)
        const result = await employee.save()
        res.status(200).json(result)
      } else throw { status : 404, resource : 'employee'}
    } catch (error) {
      next(error)
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body
      const employee = await Employee.findOne({email, password})
      if(employee) {
        delete employee.password
        console.log(employee)
        const token = getToken({employee})
        res.status(200).json({token, employee})
      } else throw { status : 400, message: 'Wrong email / password'}
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
      next(error)
    }
  }
}

module.exports = EmployeeController