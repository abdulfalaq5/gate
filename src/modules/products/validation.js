const { check } = require('express-validator')
const { validateMiddleware } = require('../../middlewares')
const { lang } = require('../../lang')

/* RULE
  ** More Documentation in here https://express-validator.github.io/docs/
*/

// Validation for creating product
const createProductValidation = [
  check('name')
    .isString()
    .withMessage(lang.__('validator.string', { field: 'Name' }))
    .notEmpty()
    .withMessage(lang.__('validator.required', { field: 'Name' }))
    .isLength({ min: 2, max: 100 })
    .withMessage(lang.__('validator.length', { field: 'Name', min: 2, max: 100 })),
  
  check('description')
    .optional()
    .isString()
    .withMessage(lang.__('validator.string', { field: 'Description' }))
    .isLength({ max: 500 })
    .withMessage(lang.__('validator.max_length', { field: 'Description', max: 500 })),
  
  check('price')
    .isNumeric()
    .withMessage(lang.__('validator.numeric', { field: 'Price' }))
    .notEmpty()
    .withMessage(lang.__('validator.required', { field: 'Price' }))
    .isFloat({ min: 0 })
    .withMessage(lang.__('validator.min_value', { field: 'Price', min: 0 })),
  
  check('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage(lang.__('validator.integer', { field: 'Stock' })),
  
  check('sku')
    .optional()
    .isString()
    .withMessage(lang.__('validator.string', { field: 'SKU' }))
    .isLength({ min: 3, max: 50 })
    .withMessage(lang.__('validator.length', { field: 'SKU', min: 3, max: 50 })),
  
  check('category')
    .optional()
    .isString()
    .withMessage(lang.__('validator.string', { field: 'Category' }))
    .isLength({ max: 50 })
    .withMessage(lang.__('validator.max_length', { field: 'Category', max: 50 })),
  
  check('brand')
    .optional()
    .isString()
    .withMessage(lang.__('validator.string', { field: 'Brand' }))
    .isLength({ max: 50 })
    .withMessage(lang.__('validator.max_length', { field: 'Brand', max: 50 })),
  
  check('images')
    .optional()
    .isArray()
    .withMessage(lang.__('validator.array', { field: 'Images' })),
  
  check('specifications')
    .optional()
    .isObject()
    .withMessage(lang.__('validator.object', { field: 'Specifications' })),
  
  check('is_active')
    .optional()
    .isBoolean()
    .withMessage(lang.__('validator.boolean', { field: 'Is Active' })),
  
  (req, res, next) => { validateMiddleware(req, res, next) }
]

// Validation for updating product
const updateProductValidation = [
  check('name')
    .optional()
    .isString()
    .withMessage(lang.__('validator.string', { field: 'Name' }))
    .isLength({ min: 2, max: 100 })
    .withMessage(lang.__('validator.length', { field: 'Name', min: 2, max: 100 })),
  
  check('description')
    .optional()
    .isString()
    .withMessage(lang.__('validator.string', { field: 'Description' }))
    .isLength({ max: 500 })
    .withMessage(lang.__('validator.max_length', { field: 'Description', max: 500 })),
  
  check('price')
    .optional()
    .isNumeric()
    .withMessage(lang.__('validator.numeric', { field: 'Price' }))
    .isFloat({ min: 0 })
    .withMessage(lang.__('validator.min_value', { field: 'Price', min: 0 })),
  
  check('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage(lang.__('validator.integer', { field: 'Stock' })),
  
  check('sku')
    .optional()
    .isString()
    .withMessage(lang.__('validator.string', { field: 'SKU' }))
    .isLength({ min: 3, max: 50 })
    .withMessage(lang.__('validator.length', { field: 'SKU', min: 3, max: 50 })),
  
  check('category')
    .optional()
    .isString()
    .withMessage(lang.__('validator.string', { field: 'Category' }))
    .isLength({ max: 50 })
    .withMessage(lang.__('validator.max_length', { field: 'Category', max: 50 })),
  
  check('brand')
    .optional()
    .isString()
    .withMessage(lang.__('validator.string', { field: 'Brand' }))
    .isLength({ max: 50 })
    .withMessage(lang.__('validator.max_length', { field: 'Brand', max: 50 })),
  
  check('images')
    .optional()
    .isArray()
    .withMessage(lang.__('validator.array', { field: 'Images' })),
  
  check('specifications')
    .optional()
    .isObject()
    .withMessage(lang.__('validator.object', { field: 'Specifications' })),
  
  check('is_active')
    .optional()
    .isBoolean()
    .withMessage(lang.__('validator.boolean', { field: 'Is Active' })),
  
  (req, res, next) => { validateMiddleware(req, res, next) }
]

// Validation for updating stock
const updateStockValidation = [
  check('stock')
    .isInt({ min: 0 })
    .withMessage(lang.__('validator.integer', { field: 'Stock' }))
    .notEmpty()
    .withMessage(lang.__('validator.required', { field: 'Stock' })),
  
  (req, res, next) => { validateMiddleware(req, res, next) }
]

// Validation for query parameters
const getProductsValidation = [
  check('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage(lang.__('validator.integer', { field: 'Page' })),
  
  check('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage(lang.__('validator.range', { field: 'Limit', min: 1, max: 100 })),
  
  check('search')
    .optional()
    .isString()
    .withMessage(lang.__('validator.string', { field: 'Search' }))
    .isLength({ max: 100 })
    .withMessage(lang.__('validator.max_length', { field: 'Search', max: 100 })),
  
  check('category')
    .optional()
    .isString()
    .withMessage(lang.__('validator.string', { field: 'Category' }))
    .isLength({ max: 50 })
    .withMessage(lang.__('validator.max_length', { field: 'Category', max: 50 })),
  
  check('brand')
    .optional()
    .isString()
    .withMessage(lang.__('validator.string', { field: 'Brand' }))
    .isLength({ max: 50 })
    .withMessage(lang.__('validator.max_length', { field: 'Brand', max: 50 })),
  
  check('is_active')
    .optional()
    .isIn(['true', 'false', ''])
    .withMessage(lang.__('validator.invalid', { field: 'Is Active' })),
  
  check('sort_by')
    .optional()
    .isIn(['name', 'price', 'stock', 'created_at', 'updated_at'])
    .withMessage(lang.__('validator.invalid', { field: 'Sort By' })),
  
  check('sort_order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage(lang.__('validator.invalid', { field: 'Sort Order' })),
  
  (req, res, next) => { validateMiddleware(req, res, next) }
]

// Validation for file upload
const uploadImageValidation = [
  check('product_id')
    .isUUID()
    .withMessage(lang.__('validator.uuid', { field: 'Product ID' }))
    .notEmpty()
    .withMessage(lang.__('validator.required', { field: 'Product ID' })),
  
  (req, res, next) => { validateMiddleware(req, res, next) }
]

// Validation for Excel import
const importExcelValidation = [
  check('file')
    .custom((value, { req }) => {
      if (!req.file) {
        throw new Error(lang.__('validator.required', { field: 'File' }))
      }
      
      const allowedMimes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ]
      
      if (!allowedMimes.includes(req.file.mimetype)) {
        throw new Error(lang.__('validator.file_type', { 
          field: 'File', 
          types: 'Excel (.xlsx, .xls)' 
        }))
      }
      
      return true
    }),
  
  (req, res, next) => { validateMiddleware(req, res, next) }
]

module.exports = {
  createProductValidation,
  updateProductValidation,
  updateStockValidation,
  getProductsValidation,
  uploadImageValidation,
  importExcelValidation
}
