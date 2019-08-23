const { model, Schema } = require('mongoose')

const employeeSchema = new Schema({
  name : {
    type : String
  },
  image : {
    type: String
  },
  address : {
    type: String
  },
  phone : {
    type: String
  },
  company : {
    type: Schema.Types.ObjectId,
    ref : 'Company'
  },
  email : {
    type: String
  },
  department : {
    type: String
  },
  contacts : [{
    type: Schema.Types.ObjectId,
    ref: 'Employee'
  }],
  password : {
    type: String
  }
})

const Employee = model('Employee', employeeSchema)

module.exports = Employee