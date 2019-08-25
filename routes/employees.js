const router = require('express').Router()
const EmployeeController = require('../controllers/employee')
const multer = require('multer')
const { authCompany } = require('../middlewares/authentication')
const { sendUploadToGCS } = require('../middlewares/gcs')

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


var uploadImage = multer({
  storage: multer.memoryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
})

router.get('/', EmployeeController.findALl)

router.use(authCompany)

router.get('/byCompany/:companyId', EmployeeController)
router.get('/byloggedin', EmployeeController.findById)
router.get('/contacts', EmployeeController)
router.post('/', uploadExcel.single('file'), EmployeeController.bulkInsert)
router.post('/uploadImage', uploadImage.single('file'), sendUploadToGCS, EmployeeController)
router.post('/login', EmployeeController.login)
router.post('/contacts/:employeeId', EmployeeController.addContact)
router.delete('/:employeeId', EmployeeController.delete)
router.delete('/contacts/:employeeId', EmployeeController.deleteContact)



module.exports = router