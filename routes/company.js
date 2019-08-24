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

router.post('/login', CompanyController.create )
router.post('/register', upload.single('image'), sendUploadToGCS, CompanyController.login)

module.exports = router