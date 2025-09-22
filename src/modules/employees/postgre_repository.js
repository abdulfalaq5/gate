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
    // Base query untuk employees dengan JOIN ke titles, departments, dan companies
    const baseQuery = this.knex(this.tableName)
      .leftJoin('titles', 'employees.title_id', 'titles.title_id')
      .leftJoin('departments', 'titles.department_id', 'departments.department_id')
      .leftJoin('companies', 'departments.company_id', 'companies.company_id')
      .select(
        'employees.*',
        'titles.title_name',
        'departments.department_name',
        'companies.company_name'
      )
      .where('employees.is_delete', false)
    
    // Pisahkan filter relasi dari filter standar
    const { filters, search } = queryParams
    const relationFilters = {}
    const standardFilters = {}
    
    Object.keys(filters).forEach(key => {
      if (['company_name', 'department_name', 'title_name'].includes(key)) {
        relationFilters[key] = filters[key]
      } else {
        standardFilters[key] = filters[key]
      }
    })
    
    // Pisahkan searchableColumns untuk tabel utama dan relasi
    const { searchableColumns } = search
    const mainTableSearchColumns = searchableColumns.filter(col => 
      !['title_name', 'department_name', 'company_name'].includes(col)
    )
    const relationSearchColumns = searchableColumns.filter(col => 
      ['title_name', 'department_name', 'company_name'].includes(col)
    )
    
    // Apply filter standar dengan semua searchableColumns (termasuk relasi)
    let dataQuery = applyStandardFilters(baseQuery.clone(), queryParams)
    
    // Tambahkan pencarian di kolom relasi jika ada searchTerm
    if (search.searchTerm && relationSearchColumns.length > 0) {
      dataQuery = dataQuery.orWhere(function() {
        relationSearchColumns.forEach((column, index) => {
          if (column === 'company_name') {
            this.where('companies.company_name', 'ilike', `%${search.searchTerm}%`)
          } else if (column === 'department_name') {
            this.where('departments.department_name', 'ilike', `%${search.searchTerm}%`)
          } else if (column === 'title_name') {
            this.where('titles.title_name', 'ilike', `%${search.searchTerm}%`)
          }
        })
      })
    }
    
    // Apply filter relasi secara manual
    if (relationFilters.company_name) {
      dataQuery = dataQuery.where('companies.company_name', 'ilike', `%${relationFilters.company_name}%`)
    }
    if (relationFilters.department_name) {
      dataQuery = dataQuery.where('departments.department_name', 'ilike', `%${relationFilters.department_name}%`)
    }
    if (relationFilters.title_name) {
      dataQuery = dataQuery.where('titles.title_name', 'ilike', `%${relationFilters.title_name}%`)
    }
    
    // Build count query untuk pagination metadata dengan filter relasi yang sama
    let countBaseQuery = this.knex(this.tableName)
      .leftJoin('titles', 'employees.title_id', 'titles.title_id')
      .leftJoin('departments', 'titles.department_id', 'departments.department_id')
      .leftJoin('companies', 'departments.company_id', 'companies.company_id')
      .select('*')
      .where('employees.is_delete', false)
    
    let countQuery = buildCountQuery(countBaseQuery, queryParams)
    
    // Apply pencarian di kolom relasi ke count query juga
    if (search.searchTerm && relationSearchColumns.length > 0) {
      countQuery = countQuery.orWhere(function() {
        relationSearchColumns.forEach((column, index) => {
          if (column === 'company_name') {
            this.where('companies.company_name', 'ilike', `%${search.searchTerm}%`)
          } else if (column === 'department_name') {
            this.where('departments.department_name', 'ilike', `%${search.searchTerm}%`)
          } else if (column === 'title_name') {
            this.where('titles.title_name', 'ilike', `%${search.searchTerm}%`)
          }
        })
      })
    }
    
    // Apply filter relasi ke count query juga
    if (relationFilters.company_name) {
      countQuery = countQuery.where('companies.company_name', 'ilike', `%${relationFilters.company_name}%`)
    }
    if (relationFilters.department_name) {
      countQuery = countQuery.where('departments.department_name', 'ilike', `%${relationFilters.department_name}%`)
    }
    if (relationFilters.title_name) {
      countQuery = countQuery.where('titles.title_name', 'ilike', `%${relationFilters.title_name}%`)
    }
    
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
      .leftJoin('titles', 'employees.title_id', 'titles.title_id')
      .leftJoin('departments', 'titles.department_id', 'departments.department_id')
      .leftJoin('companies', 'departments.company_id', 'companies.company_id')
      .select(
        'employees.*',
        'titles.title_name',
        'departments.department_name',
        'companies.company_name'
      )
      .where('employees.employee_id', id)
      .where('employees.is_delete', false)
    
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
      .leftJoin('titles', 'employees.title_id', 'titles.title_id')
      .leftJoin('departments', 'titles.department_id', 'departments.department_id')
      .leftJoin('companies', 'departments.company_id', 'companies.company_id')
      .select(
        'employees.*',
        'titles.title_name',
        'departments.department_name',
        'companies.company_name'
      )
      .where('employees.title_id', titleId)
      .where('employees.is_delete', false)
      .orderBy('employees.employee_name')
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

  /**
   * Find employee by email (alias for getEmployeeByEmail)
   */
  async findByEmail(email) {
    return await this.getEmployeeByEmail(email);
  }
}

module.exports = EmployeesRepository
