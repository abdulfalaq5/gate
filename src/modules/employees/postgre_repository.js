const { employeesColumns } = require('./column')

/**
 * Employees Repository - Database operations for employees table
 */
class EmployeesRepository {
  constructor(knex) {
    this.knex = knex
    this.tableName = 'employees'
  }

  /**
   * Get employees with pagination and filtering
   */
  async getEmployees({ page = 1, limit = 10, filters = {} }) {
    const offset = (page - 1) * limit
    
    let query = this.knex(this.tableName)
      .select('*')
      .where('is_delete', false)
    
    // Apply filters
    if (filters.search) {
      query = query.where(function() {
        this.where('employee_name', 'ilike', `%${filters.search}%`)
          .orWhere('employee_email', 'ilike', `%${filters.search}%`)
      })
    }
    
    if (filters.title_id) {
      query = query.where('title_id', filters.title_id)
    }
    
    // Get total count
    const countQuery = query.clone()
    const [{ count }] = await countQuery.count('* as count')
    
    // Get paginated results
    const employees = await query
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset)
    
    return {
      data: employees,
      pagination: {
        page,
        limit,
        total: parseInt(count),
        totalPages: Math.ceil(count / limit)
      }
    }
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
