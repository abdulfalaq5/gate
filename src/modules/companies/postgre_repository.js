const { pgCore } = require('../../config/database')
const { companiesColumns } = require('./column')

/**
 * Get companies with pagination and filtering
 */
const getCompanies = async ({ page = 1, limit = 10, filters = {} }) => {
  const offset = (page - 1) * limit
  
  let query = pgCore('companies')
    .select('*')
    .where('is_delete', false)
  
  // Apply filters
  if (filters.search) {
    query = query.where(function() {
      this.where('company_name', 'ilike', `%${filters.search}%`)
        .orWhere('company_address', 'ilike', `%${filters.search}%`)
        .orWhere('company_email', 'ilike', `%${filters.search}%`)
    })
  }
  
  if (filters.company_parent_id) {
    query = query.where('company_parent_id', filters.company_parent_id)
  }
  
  if (filters.is_delete !== undefined) {
    query = query.where('is_delete', filters.is_delete)
  }
  
  const [companies, totalCount] = await Promise.all([
    query.clone().offset(offset).limit(limit).orderBy('company_name'),
    query.clone().count('* as count').first()
  ])
  
  return {
    companies,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: parseInt(totalCount.count),
      totalPages: Math.ceil(totalCount.count / limit)
    }
  }
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