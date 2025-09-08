const { pgCore } = require('../../config/database')
const { departmentsColumns } = require('./column')
const { applyStandardFilters, buildCountQuery, formatPaginatedResponse } = require('../../utils/query_builder')

/**
 * Get departments with pagination and filtering menggunakan sistem filter standar
 */
const getDepartments = async (queryParams) => {
  // Base query untuk departments
  const baseQuery = pgCore('departments').select('*')
  
  // Apply semua filter standar
  const dataQuery = applyStandardFilters(baseQuery.clone(), queryParams)
  
  // Build count query untuk pagination metadata
  const countQuery = buildCountQuery(baseQuery, queryParams)
  
  // Execute queries secara parallel
  const [departments, countResult] = await Promise.all([
    dataQuery,
    countQuery.first()
  ])
  
  // Format response dengan pagination metadata
  return formatPaginatedResponse(departments, queryParams.pagination, countResult.total)
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