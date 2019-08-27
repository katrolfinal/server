const router = require('express').Router()
const employeeRoutes = require('./employees')
const companyRoutes = require('./company')

router.use('/employees', employeeRoutes)
router.use('/company', companyRoutes)

module.exports = router