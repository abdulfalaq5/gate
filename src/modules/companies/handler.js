const { companiesColumns, companiesValidationRules } = require('./column')
const { validateRequest } = require('../../utils/validation')
const { successResponse, errorResponse } = require('../../utils/response')
const { parseStandardQuery } = require('../../utils/pagination')
const companiesRepository = require('./postgre_repository')

/**
 * Get all companies with pagination and filtering
 */
const getCompanies = async (req, res) => {
  try {
    // Parse query parameters menggunakan sistem filter standar
    const queryParams = parseStandardQuery(req, {
      allowedSortColumns: ['company_name', 'company_address', 'company_email', 'created_at', 'updated_at'],
      defaultSort: ['company_name', 'asc'],
      searchableColumns: ['company_name', 'company_address', 'company_email'],
      allowedFilters: ['company_parent_id', 'is_delete'],
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
const getCompanyById = async (req, res) => {
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
const createCompany = async (req, res) => {
  try {
    // Validate request
    const validation = validateRequest(req.body, companiesValidationRules.create, companiesColumns)
    if (!validation.isValid) {
      return errorResponse(res, validation.errors, 400)
    }
    
    const companyData = {
      ...req.body,
      created_by: req.user?.user_id
    }
    
    const company = await companiesRepository.createCompany(companyData)
    
    return successResponse(res, company, 'Company created successfully', 201)
  } catch (error) {
    console.error('Error creating company:', error)
    return errorResponse(res, 'Failed to create company', 500)
  }
}

/**
 * Update company
 */
const updateCompany = async (req, res) => {
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
    
    return successResponse(res, company, 'Company updated successfully')
  } catch (error) {
    console.error('Error updating company:', error)
    return errorResponse(res, 'Failed to update company', 500)
  }
}

/**
 * Soft delete company
 */
const deleteCompany = async (req, res) => {
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
    
    await companiesRepository.updateCompany(id, deleteData)
    
    return successResponse(res, null, 'Company deleted successfully')
  } catch (error) {
    console.error('Error deleting company:', error)
    return errorResponse(res, 'Failed to delete company', 500)
  }
}

/**
 * Get company hierarchy (parent-child relationships)
 */
const getCompanyHierarchy = async (req, res) => {
  try {
    const hierarchy = await companiesRepository.getCompanyHierarchy()
    
    return successResponse(res, hierarchy, 'Company hierarchy retrieved successfully')
  } catch (error) {
    console.error('Error getting company hierarchy:', error)
    return errorResponse(res, 'Failed to retrieve company hierarchy', 500)
  }
}

/**
 * Get companies statistics
 */
const getCompaniesStats = async (req, res) => {
  try {
    const stats = await companiesRepository.getCompaniesStats()
    
    return successResponse(res, stats, 'Companies statistics retrieved successfully')
  } catch (error) {
    console.error('Error getting companies stats:', error)
    return errorResponse(res, 'Failed to retrieve companies statistics', 500)
  }
}

module.exports = {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
  getCompanyHierarchy,
  getCompaniesStats
}
