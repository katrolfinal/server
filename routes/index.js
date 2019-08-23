const router = require('express').Router()
const employeeRoutes = require('./employees')

router.use('/employees', employeeRoutes)

module.exports = router