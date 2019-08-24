const router = require('express').Router()
const CompanyController = require('../controllers/company')
router.post('/login', CompanyController.create )
router.post('/register', CompanyController.login)

module.exports = router