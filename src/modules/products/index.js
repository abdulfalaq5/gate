const express = require('express')
const router = express.Router()
const { verifyToken } = require('../../middlewares')
const handler = require('./handler')
const validation = require('./validation')

// Public routes (no authentication required)
router.get('/categories', handler.getCategories)
router.get('/brands', handler.getBrands)
router.get('/statistics', handler.getStatistics)

// Protected routes (authentication required)
router.use(verifyToken) // Apply JWT verification to all routes below

// CRUD operations
router.get('/', validation.getProductsValidation, handler.getAllProducts)
router.get('/:id', handler.getProductById)
router.post('/', validation.createProductValidation, handler.createProduct)
router.put('/:id', validation.updateProductValidation, handler.updateProduct)
router.delete('/:id', handler.deleteProduct)
router.delete('/:id/hard', handler.hardDeleteProduct)

// Stock management
router.patch('/:id/stock', validation.updateStockValidation, handler.updateStock)

// File operations
router.post('/upload-image', 
  validation.uploadImageValidation,
  handler.upload.single('image'),
  handler.uploadImage
)

// Excel operations
router.get('/export/excel', handler.exportExcel)
router.post('/import/excel',
  handler.upload.single('file'),
  validation.importExcelValidation,
  handler.importExcel
)

module.exports = router
