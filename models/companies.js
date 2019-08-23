const { model, Schema } = require('mongoose')
const { hashPassword } = require('../helpers/bcrypt')

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
    default: 'admin',
  },
  password: {
    type: String,
    required: [true, 'password is required !'],
    minlength: [8, 'password too short !']
  },
  email : {
    type: String,
    required: [true, 'email is required !'],
    validate: [{
      validator: function(value) {
        return new Promise ((resolve, reject) => {
          if(this.isNew) {
            User.findOne({email: value})
            .then (member => {
              if (member){
                resolve (false)
              } else {
                resolve (true)
              }
            })
            .catch(err => {
              reject (err)
            })
          } else {
            resolve(true)
          }
        })
      },
      message: props => `email already used!`
    },
    {
      validator: function(v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: props => `invalid email !`
    }]
  },
  employees : [{
    type: Schema.Types.ObjectId,
    ref: 'Employee'
  }],
  logo : {
    type: String
  }
})


usersSchema.pre('save', function(next) {
  if(!this.isModified('password')) {
    return next();
  }
  this.password = hashPassword(this.password)
  next();
})


const Company = model('Company', companySchema)

module.exports = Company