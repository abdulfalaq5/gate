const { pgCore } = require('../../config/database')
const { departmentsColumns } = require('./column')
const { applyStandardFilters, buildCountQuery, formatPaginatedResponse } = require('../../utils/query_builder')

/**
 * Get departments with pagination and filtering menggunakan sistem filter standar
 */
const getDepartments = async (queryParams) => {
  // Base query untuk departments dengan JOIN ke companies untuk mendapatkan company_name
  const baseQuery = pgCore('departments')
    .select([
      'departments.*',
      'companies.company_name'
    ])
    .leftJoin('companies', 'departments.company_id', 'companies.company_id')
    .where('departments.is_delete', false)
  
  // Clone queryParams dan modifikasi filter company_name untuk menggunakan qualified column name
  const modifiedQueryParams = { ...queryParams }
  if (modifiedQueryParams.filters && modifiedQueryParams.filters.company_name) {
    // Pindahkan filter company_name ke qualified column name
    modifiedQueryParams.filters['companies.company_name'] = modifiedQueryParams.filters.company_name
    delete modifiedQueryParams.filters.company_name
  }
  
  // Modifikasi searchableColumns untuk menggunakan qualified column name
  if (modifiedQueryParams.search && modifiedQueryParams.search.searchableColumns) {
    modifiedQueryParams.search.searchableColumns = modifiedQueryParams.search.searchableColumns.map(column => {
      if (column === 'company_name') {
        return 'companies.company_name'
      }
      return column
    })
  }
  
  // Modifikasi sorting untuk menggunakan qualified column name
  if (modifiedQueryParams.sorting && modifiedQueryParams.sorting.sortBy === 'company_name') {
    modifiedQueryParams.sorting.sortBy = 'companies.company_name'
  }
  
  // Apply semua filter standar
  const dataQuery = applyStandardFilters(baseQuery.clone(), modifiedQueryParams)
  
  // Build count query untuk pagination metadata
  const countQuery = buildCountQuery(baseQuery, modifiedQueryParams)
  
  // Execute queries secara parallel
  const [departments, countResult] = await Promise.all([
    dataQuery,
    countQuery.first()
  ])
  
  // Format response dengan pagination metadata
  return formatPaginatedResponse(departments, queryParams.pagination, countResult.total)
}

/**
 * Get department by ID (excluding soft deleted records)
 */
const getDepartmentById = async (id) => {
  const [department] = await pgCore('departments')
    .select([
      'departments.*',
      'companies.company_name'
    ])
    .leftJoin('companies', 'departments.company_id', 'companies.company_id')
    .where('departments.department_id', id)
    .where('departments.is_delete', false)
  
  return department
}

/**
 * Get department by ID (including soft deleted records)
 */
const getDepartmentByIdIncludeDeleted = async (id) => {
  const [department] = await pgCore('departments')
    .select([
      'departments.*',
      'companies.company_name'
    ])
    .leftJoin('companies', 'departments.company_id', 'companies.company_id')
    .where('departments.department_id', id)
  
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
    .select([
      'departments.*',
      'companies.company_name'
    ])
    .leftJoin('companies', 'departments.company_id', 'companies.company_id')
    .where('departments.company_id', companyId)
    .where('departments.is_delete', false)
    .orderBy('departments.department_name')
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
  getDepartmentByIdIncludeDeleted,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentByName,
  getDepartmentsByCompanyId,
  getDepartmentsStats
}