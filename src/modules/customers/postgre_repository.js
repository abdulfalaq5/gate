const { pgCore } = require('../../config/database')
const { customersColumns } = require('./column')
const { applyStandardFilters, buildCountQuery, formatPaginatedResponse } = require('../../utils/query_builder')

/**
 * Get customers with pagination and filtering menggunakan sistem filter standar
 */
const getCustomers = async (queryParams) => {
  // Base query untuk customers
  const baseQuery = pgCore('customers').select('*').where('customers.is_delete', false)
  
  // Apply semua filter standar
  const dataQuery = applyStandardFilters(baseQuery.clone(), queryParams)
  
  // Build count query untuk pagination metadata
  const countQuery = buildCountQuery(baseQuery, queryParams)
  
  // Execute queries secara parallel
  const [customers, countResult] = await Promise.all([
    dataQuery,
    countQuery.first()
  ])
  
  // Format response dengan pagination metadata
  return formatPaginatedResponse(customers, queryParams.pagination, countResult.total)
}

/**
 * Get customer by ID
 */
const getCustomerById = async (id) => {
  const [customer] = await pgCore('customers')
    .select('*')
    .where('customer_id', id)
    .where('is_delete', false)
  
  return customer
}

/**
 * Create new customer
 */
const createCustomer = async (customerData) => {
  const [customer] = await pgCore('customers')
    .insert(customerData)
    .returning('*')
  
  return customer
}

/**
 * Update customer
 */
const updateCustomer = async (id, customerData) => {
  const [customer] = await pgCore('customers')
    .where('customer_id', id)
    .update({
      ...customerData,
      updated_at: new Date().toISOString()
    })
    .returning('*')
  
  return customer
}

/**
 * Soft delete customer
 */
const deleteCustomer = async (id, deletedBy) => {
  const [customer] = await pgCore('customers')
    .where('customer_id', id)
    .update({
      is_delete: true,
      deleted_at: new Date().toISOString(),
      deleted_by: deletedBy
    })
    .returning('*')
  
  return customer
}

/**
 * Get customer by email
 */
const getCustomerByEmail = async (email) => {
  const [customer] = await pgCore('customers')
    .select('*')
    .where('customer_email', email)
    .where('is_delete', false)
  
  return customer
}

/**
 * Get customer by phone
 */
const getCustomerByPhone = async (phone) => {
  const [customer] = await pgCore('customers')
    .select('*')
    .where('customer_phone', phone)
    .where('is_delete', false)
  
  return customer
}

/**
 * Get customers by city
 */
const getCustomersByCity = async (city) => {
  return await pgCore('customers')
    .select('*')
    .where('customer_city', city)
    .where('is_delete', false)
    .orderBy('customer_name')
}

/**
 * Get customers by country
 */
const getCustomersByCountry = async (country) => {
  return await pgCore('customers')
    .select('*')
    .where('customer_country', country)
    .where('is_delete', false)
    .orderBy('customer_name')
}

/**
 * Get customers statistics
 */
const getCustomersStats = async () => {
  const [stats] = await pgCore('customers')
    .count('* as total')
    .where('is_delete', false)
  
  const [cityStats] = await pgCore('customers')
    .countDistinct('customer_city as cities')
    .where('is_delete', false)
  
  const [countryStats] = await pgCore('customers')
    .countDistinct('customer_country as countries')
    .where('is_delete', false)
  
  return {
    total: parseInt(stats.total),
    totalCities: parseInt(cityStats.cities),
    totalCountries: parseInt(countryStats.countries)
  }
}

module.exports = {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerByEmail,
  getCustomerByPhone,
  getCustomersByCity,
  getCustomersByCountry,
  getCustomersStats
}
