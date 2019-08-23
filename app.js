if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  require('dotenv').config()
  console.log('on development')
}

const express = require('express')
const app = express()
const cors = require('cors')
const routes = require('./routes')
const mongoose = require('mongoose');
const port = process.env.PORT || 3000
const url = process.env.MONGODB_URL || `mongodb://localhost:27017/final-project-${process.env.NODE_ENV}`
const errorHandler = require('./middlewares/errorHandler')

mongoose.connect(url, {
  useNewUrlParser: true,
  useCreateIndex: true,
}, (err) => {
  if(err) console.log('mongo error')
  else process.env.MONGODB_URL ? console.log('Connected db deploy') : console.log('Connected db ' + process.env.NODE_ENV)
});

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))


app.use('/api', routes)

app.use(errorHandler)

module.exports = app

app.listen(port, () => console.log(`Connected to port ${port} 💪🏻`, ))

