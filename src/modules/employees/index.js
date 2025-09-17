const express = require('express')
const multer = require('multer')
const path = require('path')
const { verifyToken } = require('../../middlewares')
const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeesByTitle
} = require('./handler')
const {
  importEmployeeData,
  getEmployeeImportTemplate
} = require('./import_handler')

const router = express.Router()

// Configure multer for CSV upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/temp/')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, 'employee-import-' + uniqueSuffix + path.extname(file.originalname))
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
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
})

// All routes require authentication
router.use(verifyToken)

// Import routes
router.get('/import/template', getEmployeeImportTemplate)
router.post('/import', upload.single('file'), importEmployeeData)

// Employees routes
router.get('/', getEmployees)
router.get('/title/:titleId', getEmployeesByTitle)
router.get('/:id', getEmployeeById)
router.post('/', createEmployee)
router.put('/:id', updateEmployee)
router.delete('/:id', deleteEmployee)

module.exports = router
