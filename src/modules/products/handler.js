/**
 *
 * @param {*} lang this is for consistent with other language message
 * @param {*} repository this is repository for postgres definition
 * @param {*} req express request you can see with console.log(req)
 * @param {*} res express response you can see with console.log(req)
 * @param {*} requestHttp if request condition is and operator, you can use this
 * @return {JSON}
*/

const repository = require('./postgre_repository')
const { baseResponse, decodeToken, uploadToMinio, generateExcel, parseExcel } = require('../../utils')
const { lang } = require('../../lang')
const multer = require('multer')
const path = require('path')

// Configure multer for file upload
const storage = multer.memoryStorage()
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'), false)
    }
  }
})

/**
 * Get all products with pagination and filters
 */
const getAllProducts = async (req, res) => {
  const params = {
    page: req.query.page,
    limit: req.query.limit,
    search: req.query.search,
    category: req.query.category,
    brand: req.query.brand,
    is_active: req.query.is_active,
    sort_by: req.query.sort_by,
    sort_order: req.query.sort_order
  }
  
  const result = await repository.getAll(params)
  return baseResponse(res, result)
}

/**
 * Get product by ID
 */
const getProductById = async (req, res) => {
  const { id } = req.params
  const result = await repository.getById(id)
  return baseResponse(res, result)
}

/**
 * Create new product
 */
const createProduct = async (req, res) => {
  const { users_id } = decodeToken('default', req)
  const result = await repository.create(req.body, users_id)
  return baseResponse(res, result)
}

/**
 * Update product
 */
const updateProduct = async (req, res) => {
  const { id } = req.params
  const { users_id } = decodeToken('default', req)
  const result = await repository.update(id, req.body, users_id)
  return baseResponse(res, result)
}

/**
 * Delete product (soft delete)
 */
const deleteProduct = async (req, res) => {
  const { id } = req.params
  const { users_id } = decodeToken('default', req)
  const result = await repository.remove(id, users_id)
  return baseResponse(res, result)
}

/**
 * Hard delete product
 */
const hardDeleteProduct = async (req, res) => {
  const { id } = req.params
  const result = await repository.hardDelete(id)
  return baseResponse(res, result)
}

/**
 * Get categories list
 */
const getCategories = async (req, res) => {
  const result = await repository.getCategories()
  return baseResponse(res, result)
}

/**
 * Get brands list
 */
const getBrands = async (req, res) => {
  const result = await repository.getBrands()
  return baseResponse(res, result)
}

/**
 * Update product stock
 */
const updateStock = async (req, res) => {
  const { id } = req.params
  const { stock } = req.body
  const { users_id } = decodeToken('default', req)
  const result = await repository.updateStock(id, stock, users_id)
  return baseResponse(res, result)
}

/**
 * Upload product image to MinIO
 */
const uploadImage = async (req, res) => {
  try {
    const { product_id } = req.body
    
    if (!req.file) {
      return baseResponse(res, {
        status: false,
        message: lang.__('validator.required', { field: 'Image file' }),
        data: null
      })
    }

    // Check if product exists
    const productResult = await repository.getById(product_id)
    if (!productResult.status) {
      return baseResponse(res, productResult)
    }

    // Generate unique filename
    const fileExtension = path.extname(req.file.originalname)
    const fileName = `products/${product_id}/${Date.now()}${fileExtension}`
    
    // Upload to MinIO
    const uploadResult = await uploadToMinio(req.file.buffer, fileName, req.file.mimetype)
    
    if (!uploadResult.status) {
      return baseResponse(res, uploadResult)
    }

    // Update product images array
    const product = productResult.data
    const currentImages = product.images || []
    const newImages = [...currentImages, uploadResult.data.url]
    
    const { users_id } = decodeToken('default', req)
    const updateResult = await repository.update(product_id, { images: newImages }, users_id)
    
    if (!updateResult.status) {
      return baseResponse(res, updateResult)
    }

    return baseResponse(res, {
      status: true,
      message: lang.__('success.upload_file'),
      data: {
        url: uploadResult.data.url,
        filename: fileName,
        product: updateResult.data
      }
    })
  } catch (error) {
    console.error('Error in uploadImage:', error)
    return baseResponse(res, {
      status: false,
      message: lang.__('error.upload_file'),
      data: null
    })
  }
}

/**
 * Export products to Excel
 */
const exportExcel = async (req, res) => {
  try {
    const params = {
      page: 1,
      limit: 10000, // Large limit for export
      search: req.query.search,
      category: req.query.category,
      brand: req.query.brand,
      is_active: req.query.is_active,
      sort_by: req.query.sort_by || 'created_at',
      sort_order: req.query.sort_order || 'desc'
    }
    
    const result = await repository.getAll(params)
    
    if (!result.status) {
      return baseResponse(res, result)
    }

    // Prepare data for Excel
    const excelData = result.data.items.map(product => ({
      'ID': product.id,
      'Name': product.name,
      'Description': product.description || '',
      'Price': product.price,
      'Stock': product.stock,
      'SKU': product.sku || '',
      'Category': product.category || '',
      'Brand': product.brand || '',
      'Images Count': product.images ? product.images.length : 0,
      'Is Active': product.is_active ? 'Yes' : 'No',
      'Created At': new Date(product.created_at).toLocaleString(),
      'Updated At': new Date(product.updated_at).toLocaleString()
    }))

    // Generate Excel file
    const excelBuffer = await generateExcel(excelData, 'Products Export')
    
    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename=products_export_${Date.now()}.xlsx`)
    res.setHeader('Content-Length', excelBuffer.length)
    
    return res.send(excelBuffer)
  } catch (error) {
    console.error('Error in exportExcel:', error)
    return baseResponse(res, {
      status: false,
      message: lang.__('error.export_file'),
      data: null
    })
  }
}

/**
 * Import products from Excel
 */
const importExcel = async (req, res) => {
  try {
    if (!req.file) {
      return baseResponse(res, {
        status: false,
        message: lang.__('validator.required', { field: 'Excel file' }),
        data: null
      })
    }

    // Parse Excel file
    const excelData = await parseExcel(req.file.buffer)
    
    if (!excelData || excelData.length === 0) {
      return baseResponse(res, {
        status: false,
        message: lang.__('error.empty_file'),
        data: null
      })
    }

    const { users_id } = decodeToken('default', req)
    const results = {
      success: [],
      errors: [],
      total: excelData.length
    }

    // Process each row
    for (let i = 0; i < excelData.length; i++) {
      const row = excelData[i]
      
      try {
        // Validate required fields
        if (!row.Name || !row.Price) {
          results.errors.push({
            row: i + 1,
            error: 'Name and Price are required fields'
          })
          continue
        }

        // Prepare product data
        const productData = {
          name: row.Name,
          description: row.Description || '',
          price: parseFloat(row.Price),
          stock: parseInt(row.Stock) || 0,
          sku: row.SKU || '',
          category: row.Category || '',
          brand: row.Brand || '',
          images: [],
          specifications: {},
          is_active: row['Is Active'] === 'Yes' || row['Is Active'] === true
        }

        // Create product
        const result = await repository.create(productData, users_id)
        
        if (result.status) {
          results.success.push({
            row: i + 1,
            data: result.data
          })
        } else {
          results.errors.push({
            row: i + 1,
            error: result.message
          })
        }
      } catch (error) {
        results.errors.push({
          row: i + 1,
          error: error.message
        })
      }
    }

    return baseResponse(res, {
      status: true,
      message: lang.__('success.import_file'),
      data: {
        success_count: results.success.length,
        error_count: results.errors.length,
        total_count: results.total,
        details: results
      }
    })
  } catch (error) {
    console.error('Error in importExcel:', error)
    return baseResponse(res, {
      status: false,
      message: lang.__('error.import_file'),
      data: null
    })
  }
}

/**
 * Get product statistics
 */
const getStatistics = async (req, res) => {
  try {
    // Get all products for statistics
    const allProductsResult = await repository.getAll({
      page: 1,
      limit: 10000,
      is_active: 'true'
    })

    if (!allProductsResult.status) {
      return baseResponse(res, allProductsResult)
    }

    const products = allProductsResult.data.items
    
    // Calculate statistics
    const stats = {
      total_products: products.length,
      total_value: products.reduce((sum, product) => sum + (product.price * product.stock), 0),
      total_stock: products.reduce((sum, product) => sum + product.stock, 0),
      average_price: products.length > 0 ? products.reduce((sum, product) => sum + product.price, 0) / products.length : 0,
      categories: {},
      brands: {},
      low_stock: products.filter(product => product.stock < 10).length,
      out_of_stock: products.filter(product => product.stock === 0).length
    }

    // Count by category
    products.forEach(product => {
      if (product.category) {
        stats.categories[product.category] = (stats.categories[product.category] || 0) + 1
      }
    })

    // Count by brand
    products.forEach(product => {
      if (product.brand) {
        stats.brands[product.brand] = (stats.brands[product.brand] || 0) + 1
      }
    })

    return baseResponse(res, {
      status: true,
      message: lang.__('success.get_data'),
      data: stats
    })
  } catch (error) {
    console.error('Error in getStatistics:', error)
    return baseResponse(res, {
      status: false,
      message: lang.__('error.database'),
      data: null
    })
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  hardDeleteProduct,
  getCategories,
  getBrands,
  updateStock,
  uploadImage,
  exportExcel,
  importExcel,
  getStatistics,
  upload // Export multer instance for use in routes
}
