const { model, Schema } = require('mongoose')

const employeeSchema = new Schema({
  name : {
    type : String
  },
  image : {
    type: String,
    default: null
  },
  address : {
    type: String,
    
  },
  phone : {
    type: String,
    
  },
  company : {
    type: Schema.Types.ObjectId,
    ref : 'Company'
  },
  email : {
    type: String,
    required: [true, 'email is required']
  },
  position : {
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