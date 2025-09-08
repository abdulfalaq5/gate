const express = require('express')
const multer = require('multer')
const path = require('path')
const { verifyToken } = require('../../middlewares')
const { importMasterData, getImportTemplate } = require('./handler')

const router = express.Router()

// Configure multer for CSV upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/temp/')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, 'import-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || path.extname(file.originalname).toLowerCase() === '.csv') {
      cb(null, true)
    } else {
      cb(new Error('Only CSV files are allowed'), false)
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
})

// All routes require authentication
router.use(verifyToken)

// Import routes
router.get('/template', getImportTemplate)
router.post('/master-data', upload.single('csvFile'), importMasterData)

module.exports = router
