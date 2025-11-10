const { customersColumns, customersValidationRules } = require('./column')
const { validateRequest } = require('../../utils/validation')
const { successResponse, errorResponse } = require('../../utils/response')
const { parseStandardQuery } = require('../../utils/pagination')
const customersRepository = require('./postgre_repository')
const databaseQueueService = require('../../services/database_queue_service')

class CustomersHandler {
  /**
   * Get all customers with pagination and filtering
   */
  async getCustomers(req, res) {
    try {
      // Support parameters from both query string (GET) and body (POST)
      const requestParams = {
        ...req.query,  // GET parameters
        ...req.body    // POST parameters
      }
      
      // Create a modified request object for parseStandardQuery
      const modifiedReq = {
        ...req,
        query: requestParams
      }

      // Parse query parameters menggunakan sistem filter standar
      const queryParams = parseStandardQuery(modifiedReq, {
        allowedSortColumns: ['customer_name', 'customer_email', 'customer_phone', 'job_title', 'customer_city', 'customer_country', 'created_at', 'updated_at'],
        defaultSort: ['created_at', 'desc'],
        searchableColumns: ['customer_name', 'customer_email', 'customer_phone', 'job_title', 'customer_address', 'customer_city', 'customer_state', 'customer_country'],
        allowedFilters: ['customer_name', 'customer_email', 'customer_phone', 'job_title', 'customer_city', 'customer_state', 'customer_country', 'is_delete'],
        dateColumn: 'created_at'
      })
      
      const result = await customersRepository.getCustomers(queryParams)
      
      return successResponse(res, result, 'Customers retrieved successfully')
    } catch (error) {
      console.error('Error getting customers:', error)
      return errorResponse(res, 'Failed to retrieve customers', 500)
    }
  }

  /**
   * Get customer by ID
   */
  async getCustomerById(req, res) {
    try {
      const { id } = req.params
      
      const customer = await customersRepository.getCustomerById(id)
      if (!customer) {
        return errorResponse(res, 'Customer not found', 404)
      }
      
      return successResponse(res, customer, 'Customer retrieved successfully')
    } catch (error) {
      console.error('Error getting customer:', error)
      return errorResponse(res, 'Failed to retrieve customer', 500)
    }
  }

  /**
   * Create new customer
   */
  async createCustomer(req, res) {
    try {
      // Support parameters from both query string (GET) and body (POST)
      const requestParams = {
        ...req.query,  // GET parameters
        ...req.body    // POST parameters
      }

      // Validate request
      const validation = validateRequest(requestParams, customersValidationRules.create, customersColumns)
      if (!validation.isValid) {
        return errorResponse(res, validation.errors, 400)
      }
      
      const customerData = {
        ...requestParams,
        created_by: req.user?.user_id || req.user?.employee_id
      }
      
      const customer = await customersRepository.createCustomer(customerData)
      
      // Kirim queue ke RabbitMQ untuk operasi CREATE
      await databaseQueueService.sendCustomersCreateQueue(customerData, customer)
      
      return successResponse(res, customer, 'Customer created successfully', 201)
    } catch (error) {
      console.error('Error creating customer:', error)
      return errorResponse(res, 'Failed to create customer', 500)
    }
  }

  /**
   * Update customer
   */
  async updateCustomer(req, res) {
    try {
      const { id } = req.params
      
      // Check if customer exists
      const existingCustomer = await customersRepository.getCustomerById(id)
      if (!existingCustomer) {
        return errorResponse(res, 'Customer not found', 404)
      }
      
      // Validate request
      const validation = validateRequest(req.body, customersValidationRules.update, customersColumns)
      if (!validation.isValid) {
        return errorResponse(res, validation.errors, 400)
      }
      
      const updateData = {
        ...req.body,
        updated_by: req.user?.user_id || req.user?.employee_id,
        updated_at: new Date()
      }
      
      const customer = await customersRepository.updateCustomer(id, updateData)
      
      // Kirim queue ke RabbitMQ untuk operasi UPDATE
      await databaseQueueService.sendCustomersUpdateQueue(id, updateData, customer)
      
      return successResponse(res, customer, 'Customer updated successfully')
    } catch (error) {
      console.error('Error updating customer:', error)
      return errorResponse(res, 'Failed to update customer', 500)
    }
  }

  /**
   * Soft delete customer
   */
  async deleteCustomer(req, res) {
    try {
      const { id } = req.params
      
      // Check if customer exists
      const existingCustomer = await customersRepository.getCustomerById(id)
      if (!existingCustomer) {
        return errorResponse(res, 'Customer not found', 404)
      }
      
      const deleteData = {
        is_delete: true,
        deleted_at: new Date(),
        deleted_by: req.user?.user_id || req.user?.employee_id
      }
      
      const result = await customersRepository.updateCustomer(id, deleteData)
      
      // Kirim queue ke RabbitMQ untuk operasi DELETE
      await databaseQueueService.sendCustomersDeleteQueue(id, deleteData, result)
      
      return successResponse(res, null, 'Customer deleted successfully')
    } catch (error) {
      console.error('Error deleting customer:', error)
      return errorResponse(res, 'Failed to delete customer', 500)
    }
  }

  /**
   * Get customers statistics
   */
  async getCustomersStats(req, res) {
    try {
      // Support parameters from both query string (GET) and body (POST)
      const requestParams = {
        ...req.query,  // GET parameters
        ...req.body    // POST parameters
      }

      const stats = await customersRepository.getCustomersStats(requestParams)
      
      return successResponse(res, stats, 'Customers statistics retrieved successfully')
    } catch (error) {
      console.error('Error getting customers stats:', error)
      return errorResponse(res, 'Failed to retrieve customers statistics', 500)
    }
  }
}

module.exports = new CustomersHandler()
