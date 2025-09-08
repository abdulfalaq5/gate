const { pgCore } = require('../../config/database')
const { companiesColumns } = require('./column')
const { applyStandardFilters, buildCountQuery, formatPaginatedResponse } = require('../../utils/query_builder')

/**
 * Get companies with pagination and filtering menggunakan sistem filter standar
 */
const getCompanies = async (queryParams) => {
  // Base query untuk companies
  const baseQuery = pgCore('companies').select('*')
  
  // Apply semua filter standar
  const dataQuery = applyStandardFilters(baseQuery.clone(), queryParams)
  
  // Build count query untuk pagination metadata
  const countQuery = buildCountQuery(baseQuery, queryParams)
  
  // Execute queries secara parallel
  const [companies, countResult] = await Promise.all([
    dataQuery,
    countQuery.first()
  ])
  
  // Format response dengan pagination metadata
  return formatPaginatedResponse(companies, queryParams.pagination, countResult.total)
}

/**
 * Get company by ID
 */
const getCompanyById = async (id) => {
  const [company] = await pgCore('companies')
    .select('*')
    .where('company_id', id)
    .where('is_delete', false)
  
  return company
}

/**
 * Create new company
 */
const createCompany = async (companyData) => {
  const [company] = await pgCore('companies')
    .insert(companyData)
    .returning('*')
  
  return company
}

/**
 * Update company
 */
const updateCompany = async (id, companyData) => {
  const [company] = await pgCore('companies')
    .where('company_id', id)
    .update({
      ...companyData,
      updated_at: new Date().toISOString()
    })
    .returning('*')
  
  return company
}

/**
 * Soft delete company
 */
const deleteCompany = async (id, deletedBy) => {
  const [company] = await pgCore('companies')
    .where('company_id', id)
    .update({
      is_delete: true,
      deleted_at: new Date().toISOString(),
      deleted_by: deletedBy
    })
    .returning('*')
  
  return company
}

/**
 * Get company hierarchy
 */
const getCompanyHierarchy = async () => {
  return await pgCore('companies')
    .select('*')
    .where('is_delete', false)
    .orderBy('company_name')
}

/**
 * Get company by name
 */
const getCompanyByName = async (name) => {
  const [company] = await pgCore('companies')
    .select('*')
    .where('company_name', name)
    .where('is_delete', false)
  
  return company
}

/**
 * Check if company has children
 */
const hasChildren = async (companyId) => {
  const [result] = await pgCore('companies')
    .count('* as count')
    .where('company_parent_id', companyId)
    .where('is_delete', false)
  
  return parseInt(result.count) > 0
}

/**
 * Get companies statistics
 */
const getCompaniesStats = async () => {
  const [stats] = await pgCore('companies')
    .count('* as total')
    .count('company_parent_id as parents')
    .where('is_delete', false)
  
  return {
    total: parseInt(stats.total),
    parentCompanies: parseInt(stats.total) - parseInt(stats.parents),
    childCompanies: parseInt(stats.parents)
  }
}

/**
 * Get companies by parent ID
 */
const getCompaniesByParentId = async (parentId) => {
  return await pgCore('companies')
    .select('*')
    .where('company_parent_id', parentId)
    .where('is_delete', false)
    .orderBy('company_name')
}

module.exports = {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
  getCompanyHierarchy,
  getCompanyByName,
  hasChildren,
  getCompaniesStats,
  getCompaniesByParentId
}