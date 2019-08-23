const router = require('express').Router()
const EmployeeController = require('../controllers/employee')
const multer = require('multer')
global.__basedir = __dirname;
var storage = multer.diskStorage({ 
  destination: function (req, file, cb) {
      cb(null, __basedir + '/excelTmp/')
  },
  filename: function (req, file, cb) {
      var datetimestamp = Date.now();
      cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
  }
});

var upload = multer({ storage })

router.get('/', EmployeeController.findALl)
router.get('/byCompany/:companyId', EmployeeController)
router.get('/byloggedin', EmployeeController.findById)
router.get('/contacts', EmployeeController)
router.post('/', upload.single('file'), EmployeeController.bulkInsert)
router.delete('/:employeeId', EmployeeController.delete)
router.delete('/contacts/:employeeId', EmployeeController.deleteContact)


module.exports = router