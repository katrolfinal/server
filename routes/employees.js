const router = require('express').Router()
const EmployeeController = require('../controllers/employee')
const multer = require('multer')
const { authCompany, authEmployee } = require('../middlewares/authentication')
const { sendUploadToGCS } = require('../middlewares/gcs')
const path = require('path')

var storage = multer.diskStorage({ 
  destination: function (req, file, cb) {
    console.log(path.join(__dirname, '../excelTmp/'), '<<<<<<<<<<<<<<')
    cb(null, path.join(__dirname, '../excelTmp/'))
  },
  filename: function (req, file, cb) {
    var datetimestamp = Date.now();
    cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
  }
});

var uploadExcel = multer({ storage })


const uploadImage = multer({
  storage: multer.MemoryStorage,
  limits: {
      fileSize: 10 * 1024 * 1024, // Maximum file size is 10MB
  },
});

router.get('/', EmployeeController.findALl) // //
router.post('/login', EmployeeController.login) /////



router.get('/byCompany', authEmployee, EmployeeController.findByCompany) // 
router.put('/uploadImage', authEmployee, uploadImage.single('image'), sendUploadToGCS, EmployeeController.uploadImage) //
router.put('/contacts/:employeeId', authEmployee, EmployeeController.addContact) //
router.delete('/contacts/:employeeId', authEmployee,  EmployeeController.deleteContact) //


router.use(authCompany)
router.post('/', uploadExcel.single('file'), EmployeeController.bulkInsert) // /////
router.post('/single', EmployeeController.createOne) ////////
router.delete('/:employeeId', EmployeeController.delete) // /////
router.put('/:employeeId', EmployeeController.update) // /////



module.exports = router