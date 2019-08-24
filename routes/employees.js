const router = require('express').Router()
const EmployeeController = require('../controllers/employee')
const multer = require('multer')

var storage = multer.diskStorage({ 
  destination: function (req, file, cb) {
    console.log(__basedir + '/excelTmp/')
    cb(null, '/Users/jays/hacktiv/pinal_projec/server/excelTmp/')
  },
  filename: function (req, file, cb) {
    console.log(file, '<<<<<<<<')
    var datetimestamp = Date.now();
    cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
  }
});

var uploadExcel = multer({ storage })


router.get('/', EmployeeController.findALl)
router.get('/byCompany/:companyId', EmployeeController)
router.get('/byloggedin', EmployeeController.findById)
router.get('/contacts', EmployeeController)
router.post('/', uploadExcel.single('file'), EmployeeController.bulkInsert)
router.delete('/:employeeId', EmployeeController.delete)
router.delete('/contacts/:employeeId', EmployeeController.deleteContact)


module.exports = router