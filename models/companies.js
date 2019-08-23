const { model, Schema } = require('mongoose')

const companySchema = new Schema({
  name : {
    type: String
  },
  password : {
    type: String,
    required: [true, 'Password must be required' ]
  },
  username : {
    type: String,
    default: 'admin'
  },
  employees : [{
    type: Schema.Types.ObjectId,
    ref: 'Employee'
  }],
  logo : {
    type: String
  }
})

const Company = model('Company', companySchema)

module.exports = Employee