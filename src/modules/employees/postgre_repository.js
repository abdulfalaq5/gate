const { employeesColumns } = require('./column')
const { applyStandardFilters, buildCountQuery, formatPaginatedResponse } = require('../../utils/query_builder')

/**
 * Employees Repository - Database operations for employees table
 */
class EmployeesRepository {
  constructor(knex) {
    this.knex = knex
    this.tableName = 'employees'
  }

  /**
   * Get employees with pagination and filtering menggunakan sistem filter standar
   */
  async getEmployees(queryParams) {
    // Base query untuk employees
    const baseQuery = this.knex(this.tableName).select('*')
    
    // Apply semua filter standar
    const dataQuery = applyStandardFilters(baseQuery.clone(), queryParams)
    
    // Build count query untuk pagination metadata
    const countQuery = buildCountQuery(baseQuery, queryParams)
    
    // Execute queries secara parallel
    const [employees, countResult] = await Promise.all([
      dataQuery,
      countQuery.first()
    ])
    
    // Format response dengan pagination metadata
    return formatPaginatedResponse(employees, queryParams.pagination, countResult.total)
  }

  /**
   * Get employee by ID
   */
  async getEmployeeById(id) {
    const [employee] = await this.knex(this.tableName)
      .select('*')
      .where('employee_id', id)
      .where('is_delete', false)
    
    return employee
  }

  /**
   * Create new employee
   */
  async createEmployee(employeeData) {
    const [employee] = await this.knex(this.tableName)
      .insert({
        ...employeeData,
        created_at: new Date()
      })
      .returning('*')
    
    return employee
  }

  /**
   * Update employee
   */
  async updateEmployee(id, updateData) {
    const [employee] = await this.knex(this.tableName)
      .where('employee_id', id)
      .update(updateData)
      .returning('*')
    
    return employee
  }

  /**
   * Get employees by title ID
   */
  async getEmployeesByTitleId(titleId) {
    return await this.knex(this.tableName)
      .select('*')
      .where('title_id', titleId)
      .where('is_delete', false)
      .orderBy('employee_name')
  }

  /**
   * Get employee by email
   */
  async getEmployeeByEmail(email) {
    const [employee] = await this.knex(this.tableName)
      .select('*')
      .where('employee_email', email)
      .where('is_delete', false)
    
    return employee
  }
}

module.exports = EmployeesRepository
