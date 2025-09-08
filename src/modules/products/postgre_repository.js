const { corePostgres } = require('../../../repository/postgres/core_postgres')
const { baseResponse, mappingErrorValidation } = require('../../utils')
const { lang } = require('../../lang')

/**
 * Get all products with pagination and filters
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.search - Search term
 * @param {string} params.category - Category filter
 * @param {string} params.brand - Brand filter
 * @param {boolean} params.is_active - Active status filter
 * @param {string} params.sort_by - Sort field
 * @param {string} params.sort_order - Sort order (asc/desc)
 * @returns {Promise<Object>} Response object
 */
const getAll = async (params) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      category = '',
      brand = '',
      is_active = '',
      sort_by = 'created_at',
      sort_order = 'desc'
    } = params

    let query = corePostgres('products')
      .select([
        'id',
        'name',
        'description',
        'price',
        'stock',
        'sku',
        'category',
        'brand',
        'images',
        'specifications',
        'is_active',
        'created_at',
        'updated_at'
      ])

    // Apply filters
    if (search) {
      query = query.where(function() {
        this.where('name', 'ilike', `%${search}%`)
          .orWhere('description', 'ilike', `%${search}%`)
          .orWhere('sku', 'ilike', `%${search}%`)
      })
    }

    if (category) {
      query = query.where('category', category)
    }

    if (brand) {
      query = query.where('brand', brand)
    }

    if (is_active !== '') {
      query = query.where('is_active', is_active === 'true')
    }

    // Apply sorting
    query = query.orderBy(sort_by, sort_order)

    // Get total count
    const countQuery = query.clone().clearSelect().clearOrder().count('* as total')
    const [{ total }] = await countQuery

    // Apply pagination
    const offset = (page - 1) * limit
    query = query.limit(limit).offset(offset)

    const data = await query

    return {
      status: true,
      message: lang.__('success.get_data'),
      data: {
        items: data,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(total),
          total_pages: Math.ceil(total / limit)
        }
      }
    }
  } catch (error) {
    console.error('Error in getAll products:', error)
    return {
      status: false,
      message: lang.__('error.database'),
      data: null
    }
  }
}

/**
 * Get product by ID
 * @param {string} id - Product ID
 * @returns {Promise<Object>} Response object
 */
const getById = async (id) => {
  try {
    const product = await corePostgres('products')
      .select([
        'id',
        'name',
        'description',
        'price',
        'stock',
        'sku',
        'category',
        'brand',
        'images',
        'specifications',
        'is_active',
        'created_at',
        'updated_at'
      ])
      .where('id', id)
      .first()

    if (!product) {
      return {
        status: false,
        message: lang.__('error.not_found', { field: 'Product' }),
        data: null
      }
    }

    return {
      status: true,
      message: lang.__('success.get_data'),
      data: product
    }
  } catch (error) {
    console.error('Error in getById product:', error)
    return {
      status: false,
      message: lang.__('error.database'),
      data: null
    }
  }
}

/**
 * Create new product
 * @param {Object} data - Product data
 * @param {string} userId - User ID who created the product
 * @returns {Promise<Object>} Response object
 */
const create = async (data, userId) => {
  try {
    const productData = {
      ...data,
      created_by: userId,
      updated_by: userId,
      created_at: new Date(),
      updated_at: new Date()
    }

    const [product] = await corePostgres('products')
      .insert(productData)
      .returning([
        'id',
        'name',
        'description',
        'price',
        'stock',
        'sku',
        'category',
        'brand',
        'images',
        'specifications',
        'is_active',
        'created_at',
        'updated_at'
      ])

    return {
      status: true,
      message: lang.__('success.create_data', { field: 'Product' }),
      data: product
    }
  } catch (error) {
    console.error('Error in create product:', error)
    
    if (error.code === '23505') { // Unique constraint violation
      return {
        status: false,
        message: lang.__('error.unique', { field: 'SKU' }),
        data: null
      }
    }

    return {
      status: false,
      message: lang.__('error.database'),
      data: null
    }
  }
}

/**
 * Update product
 * @param {string} id - Product ID
 * @param {Object} data - Updated product data
 * @param {string} userId - User ID who updated the product
 * @returns {Promise<Object>} Response object
 */
const update = async (id, data, userId) => {
  try {
    const updateData = {
      ...data,
      updated_by: userId,
      updated_at: new Date()
    }

    const [product] = await corePostgres('products')
      .where('id', id)
      .update(updateData)
      .returning([
        'id',
        'name',
        'description',
        'price',
        'stock',
        'sku',
        'category',
        'brand',
        'images',
        'specifications',
        'is_active',
        'created_at',
        'updated_at'
      ])

    if (!product) {
      return {
        status: false,
        message: lang.__('error.not_found', { field: 'Product' }),
        data: null
      }
    }

    return {
      status: true,
      message: lang.__('success.update_data', { field: 'Product' }),
      data: product
    }
  } catch (error) {
    console.error('Error in update product:', error)
    
    if (error.code === '23505') { // Unique constraint violation
      return {
        status: false,
        message: lang.__('error.unique', { field: 'SKU' }),
        data: null
      }
    }

    return {
      status: false,
      message: lang.__('error.database'),
      data: null
    }
  }
}

/**
 * Delete product (soft delete)
 * @param {string} id - Product ID
 * @param {string} userId - User ID who deleted the product
 * @returns {Promise<Object>} Response object
 */
const remove = async (id, userId) => {
  try {
    const [product] = await corePostgres('products')
      .where('id', id)
      .update({
        is_active: false,
        updated_by: userId,
        updated_at: new Date()
      })
      .returning(['id', 'name'])

    if (!product) {
      return {
        status: false,
        message: lang.__('error.not_found', { field: 'Product' }),
        data: null
      }
    }

    return {
      status: true,
      message: lang.__('success.delete_data', { field: 'Product' }),
      data: product
    }
  } catch (error) {
    console.error('Error in remove product:', error)
    return {
      status: false,
      message: lang.__('error.database'),
      data: null
    }
  }
}

/**
 * Hard delete product
 * @param {string} id - Product ID
 * @returns {Promise<Object>} Response object
 */
const hardDelete = async (id) => {
  try {
    const deletedCount = await corePostgres('products')
      .where('id', id)
      .del()

    if (deletedCount === 0) {
      return {
        status: false,
        message: lang.__('error.not_found', { field: 'Product' }),
        data: null
      }
    }

    return {
      status: true,
      message: lang.__('success.delete_data', { field: 'Product' }),
      data: { id }
    }
  } catch (error) {
    console.error('Error in hardDelete product:', error)
    return {
      status: false,
      message: lang.__('error.database'),
      data: null
    }
  }
}

/**
 * Get categories list
 * @returns {Promise<Object>} Response object
 */
const getCategories = async () => {
  try {
    const categories = await corePostgres('products')
      .select('category')
      .whereNotNull('category')
      .where('is_active', true)
      .groupBy('category')
      .orderBy('category')

    return {
      status: true,
      message: lang.__('success.get_data'),
      data: categories.map(item => item.category)
    }
  } catch (error) {
    console.error('Error in getCategories:', error)
    return {
      status: false,
      message: lang.__('error.database'),
      data: null
    }
  }
}

/**
 * Get brands list
 * @returns {Promise<Object>} Response object
 */
const getBrands = async () => {
  try {
    const brands = await corePostgres('products')
      .select('brand')
      .whereNotNull('brand')
      .where('is_active', true)
      .groupBy('brand')
      .orderBy('brand')

    return {
      status: true,
      message: lang.__('success.get_data'),
      data: brands.map(item => item.brand)
    }
  } catch (error) {
    console.error('Error in getBrands:', error)
    return {
      status: false,
      message: lang.__('error.database'),
      data: null
    }
  }
}

/**
 * Update product stock
 * @param {string} id - Product ID
 * @param {number} stock - New stock amount
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Response object
 */
const updateStock = async (id, stock, userId) => {
  try {
    const [product] = await corePostgres('products')
      .where('id', id)
      .update({
        stock: parseInt(stock),
        updated_by: userId,
        updated_at: new Date()
      })
      .returning(['id', 'name', 'stock'])

    if (!product) {
      return {
        status: false,
        message: lang.__('error.not_found', { field: 'Product' }),
        data: null
      }
    }

    return {
      status: true,
      message: lang.__('success.update_data', { field: 'Stock' }),
      data: product
    }
  } catch (error) {
    console.error('Error in updateStock:', error)
    return {
      status: false,
      message: lang.__('error.database'),
      data: null
    }
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  hardDelete,
  getCategories,
  getBrands,
  updateStock
}
