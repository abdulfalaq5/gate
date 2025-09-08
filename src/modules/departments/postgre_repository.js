const { pgCore } = require('../../config/database')
const { departmentsColumns } = require('./column')

/**
 * Get departments with pagination and filtering
 */
const getDepartments = async ({ page = 1, limit = 10, filters = {} }) => {
  const offset = (page - 1) * limit
  
  let query = pgCore('departments')
    .select('*')
    .where('is_delete', false)
  
  // Apply filters
  if (filters.search) {
    query = query.where(function() {
      this.where('department_name', 'ilike', `%${filters.search}%`)
    })
  }
  
  if (filters.company_id) {
    query = query.where('company_id', filters.company_id)
  }
  
  if (filters.department_parent_id) {
    query = query.where('department_parent_id', filters.department_parent_id)
  }
  
  if (filters.is_delete !== undefined) {
    query = query.where('is_delete', filters.is_delete)
  }
  
  const [departments, totalCount] = await Promise.all([
    query.clone().offset(offset).limit(limit).orderBy('department_name'),
    query.clone().count('* as count').first()
  ])
  
  return {
    departments,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: parseInt(totalCount.count),
      totalPages: Math.ceil(totalCount.count / limit)
    }
  }
}

/**
 * Get department by ID
 */
const getDepartmentById = async (id) => {
  const [department] = await pgCore('departments')
    .select('*')
    .where('department_id', id)
    .where('is_delete', false)
  
  return department
}

/**
 * Create new department
 */
const createDepartment = async (departmentData) => {
  const [department] = await pgCore('departments')
    .insert(departmentData)
    .returning('*')
  
  return department
}

/**
 * Update department
 */
const updateDepartment = async (id, departmentData) => {
  const [department] = await pgCore('departments')
    .where('department_id', id)
    .update({
      ...departmentData,
      updated_at: new Date().toISOString()
    })
    .returning('*')
  
  return department
}

/**
 * Soft delete department
 */
const deleteDepartment = async (id, deletedBy) => {
  const [department] = await pgCore('departments')
    .where('department_id', id)
    .update({
      is_delete: true,
      deleted_at: new Date().toISOString(),
      deleted_by: deletedBy
    })
    .returning('*')
  
  return department
}

/**
 * Get department by name
 */
const getDepartmentByName = async (name) => {
  const [department] = await pgCore('departments')
    .select('*')
    .where('department_name', name)
    .where('is_delete', false)
  
  return department
}

/**
 * Get departments by company ID
 */
const getDepartmentsByCompanyId = async (companyId) => {
  return await pgCore('departments')
    .select('*')
    .where('company_id', companyId)
    .where('is_delete', false)
    .orderBy('department_name')
}

/**
 * Get departments statistics
 */
const getDepartmentsStats = async () => {
  const [stats] = await pgCore('departments')
    .count('* as total')
    .where('is_delete', false)
  
  return {
    total: parseInt(stats.total)
  }
}

module.exports = {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentByName,
  getDepartmentsByCompanyId,
  getDepartmentsStats
}