const { companiesColumns, companiesValidationRules } = require('./column')
const { validateRequest } = require('../../utils/validation')
const { successResponse, errorResponse } = require('../../utils/response')
const { parseStandardQuery } = require('../../utils/pagination')
const companiesRepository = require('./postgre_repository')
const databaseQueueService = require('../../services/database_queue_service')

class CompaniesHandler {
  /**
   * Get all companies with pagination and filtering
   */
  async getCompanies(req, res) {
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
        allowedSortColumns: ['company_name', 'company_address', 'company_email', 'created_at', 'updated_at'],
        defaultSort: ['created_at', 'desc'],
        searchableColumns: ['company_name', 'company_address', 'company_email'],
        allowedFilters: ['company_name', 'company_address', 'company_email', 'company_parent_id', 'is_delete'],
        dateColumn: 'created_at'
      })
      
      const result = await companiesRepository.getCompanies(queryParams)
      
      return successResponse(res, result, 'Companies retrieved successfully')
    } catch (error) {
      console.error('Error getting companies:', error)
      return errorResponse(res, 'Failed to retrieve companies', 500)
    }
  }

  /**
   * Get company by ID
   */
  async getCompanyById(req, res) {
    try {
      const { id } = req.params
      
      const company = await companiesRepository.getCompanyById(id)
      if (!company) {
        return errorResponse(res, 'Company not found', 404)
      }
      
      return successResponse(res, company, 'Company retrieved successfully')
    } catch (error) {
      console.error('Error getting company:', error)
      return errorResponse(res, 'Failed to retrieve company', 500)
    }
  }

  /**
   * Create new company
   */
  async createCompany(req, res) {
    try {
      // Support parameters from both query string (GET) and body (POST)
      const requestParams = {
        ...req.query,  // GET parameters
        ...req.body    // POST parameters
      }

      // Validate request
      const validation = validateRequest(requestParams, companiesValidationRules.create, companiesColumns)
      if (!validation.isValid) {
        return errorResponse(res, validation.errors, 400)
      }
      
      const companyData = {
        ...requestParams,
        created_by: req.user?.user_id
      }
      
      const company = await companiesRepository.createCompany(companyData)
      
      // Kirim queue ke RabbitMQ untuk operasi CREATE
      await databaseQueueService.sendCompaniesCreateQueue(companyData, company)
      
      return successResponse(res, company, 'Company created successfully', 201)
    } catch (error) {
      console.error('Error creating company:', error)
      return errorResponse(res, 'Failed to create company', 500)
    }
  }

  /**
   * Update company
   */
  async updateCompany(req, res) {
    try {
      const { id } = req.params
      
      // Check if company exists
      const existingCompany = await companiesRepository.getCompanyById(id)
      if (!existingCompany) {
        return errorResponse(res, 'Company not found', 404)
      }
      
      // Validate request
      const validation = validateRequest(req.body, companiesValidationRules.update, companiesColumns)
      if (!validation.isValid) {
        return errorResponse(res, validation.errors, 400)
      }
      
      const updateData = {
        ...req.body,
        updated_by: req.user?.user_id,
        updated_at: new Date()
      }
      
      const company = await companiesRepository.updateCompany(id, updateData)
      
      // Kirim queue ke RabbitMQ untuk operasi UPDATE
      await databaseQueueService.sendCompaniesUpdateQueue(id, updateData, company)
      
      return successResponse(res, company, 'Company updated successfully')
    } catch (error) {
      console.error('Error updating company:', error)
      return errorResponse(res, 'Failed to update company', 500)
    }
  }

  /**
   * Soft delete company
   */
  async deleteCompany(req, res) {
    try {
      const { id } = req.params
      
      // Check if company exists
      const existingCompany = await companiesRepository.getCompanyById(id)
      if (!existingCompany) {
        return errorResponse(res, 'Company not found', 404)
      }
      
      const deleteData = {
        is_delete: true,
        deleted_at: new Date(),
        deleted_by: req.user?.user_id
      }
      
      const result = await companiesRepository.updateCompany(id, deleteData)
      
      // Kirim queue ke RabbitMQ untuk operasi DELETE
      await databaseQueueService.sendCompaniesDeleteQueue(id, deleteData, result)
      
      return successResponse(res, null, 'Company deleted successfully')
    } catch (error) {
      console.error('Error deleting company:', error)
      return errorResponse(res, 'Failed to delete company', 500)
    }
  }

  /**
   * Get company hierarchy (parent-child relationships)
   */
  async getCompanyHierarchy(req, res) {
    try {
      // Support parameters from both query string (GET) and body (POST)
      const requestParams = {
        ...req.query,  // GET parameters
        ...req.body    // POST parameters
      }

      const hierarchy = await companiesRepository.getCompanyHierarchy(requestParams)
      
      return successResponse(res, hierarchy, 'Company hierarchy retrieved successfully')
    } catch (error) {
      console.error('Error getting company hierarchy:', error)
      return errorResponse(res, 'Failed to retrieve company hierarchy', 500)
    }
  }

  /**
   * Get companies statistics
   */
  async getCompaniesStats(req, res) {
    try {
      // Support parameters from both query string (GET) and body (POST)
      const requestParams = {
        ...req.query,  // GET parameters
        ...req.body    // POST parameters
      }

      const stats = await companiesRepository.getCompaniesStats(requestParams)
      
      return successResponse(res, stats, 'Companies statistics retrieved successfully')
    } catch (error) {
      console.error('Error getting companies stats:', error)
      return errorResponse(res, 'Failed to retrieve companies statistics', 500)
    }
  }
}

module.exports = new CompaniesHandler()
