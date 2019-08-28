const router = require('express').Router()
const CompanyController = require('../controllers/company')
const _multer = require('multer')
const { sendUploadToGCS } = require('../middlewares/gcs')
const upload = _multer({
  storage: _multer.MemoryStorage,
  limits: {
      fileSize: 10 * 1024 * 1024, // Maximum file size is 10MB
  },
});
const {authCompany} = require('../middlewares/authentication')

router.post('/login', CompanyController.login )
router.post('/register', upload.single('image'), sendUploadToGCS, CompanyController.create)
router.get('/', CompanyController.findAll)
router.put('/', authCompany, CompanyController.update)

module.exports = router