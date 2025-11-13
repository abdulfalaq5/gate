const { employeesColumns } = require('./column')
const { applyStandardFilters, buildCountQuery, formatSimplePaginatedResponse } = require('../../utils/query_builder')

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
        'departments.department_id',
        'companies.company_name',
        'companies.company_id'
      )
      .where('employees.is_delete', false)
    
    // Pisahkan filter relasi dari filter standar
    const { filters, search } = queryParams
    const relationFilters = {}
    const standardFilters = {}
    
    Object.keys(filters).forEach(key => {
      if (['company_name', 'department_name', 'title_name', 'position'].includes(key)) {
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
    
    // Gunakan filter standar tanpa filter relasi tambahan
    const standardQueryParams = {
      ...queryParams,
      filters: standardFilters
    }
    
    // Apply filter standar dengan semua searchableColumns (termasuk relasi)
    let dataQuery = applyStandardFilters(baseQuery.clone(), standardQueryParams)
    
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
    if (relationFilters.position) {
      dataQuery = dataQuery.where('titles.title_name', 'ilike', `%${relationFilters.position}%`)
    }
    
    // Build count query untuk pagination metadata dengan filter relasi yang sama
    let countBaseQuery = this.knex(this.tableName)
      .leftJoin('titles', 'employees.title_id', 'titles.title_id')
      .leftJoin('departments', 'titles.department_id', 'departments.department_id')
      .leftJoin('companies', 'departments.company_id', 'companies.company_id')
      .select('*')
      .where('employees.is_delete', false)
    
    let countQuery = buildCountQuery(countBaseQuery, standardQueryParams)
    
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
    if (relationFilters.position) {
      countQuery = countQuery.where('titles.title_name', 'ilike', `%${relationFilters.position}%`)
    }
    
    // Execute queries secara parallel
    const [employees, countResult] = await Promise.all([
      dataQuery,
      countQuery.first()
    ])
    
    // Format response dengan pagination metadata
    return formatSimplePaginatedResponse(employees, queryParams.pagination, countResult.total)
  }

  /**
   * Get employee by ID with permission details
   */
  async getEmployeeById(id) {
    try {
      // Get basic employee data
      const [employee] = await this.knex(this.tableName)
        .leftJoin('titles', 'employees.title_id', 'titles.title_id')
        .leftJoin('departments', 'titles.department_id', 'departments.department_id')
        .leftJoin('companies', 'departments.company_id', 'companies.company_id')
        .select(
          'employees.*',
          'titles.title_name',
          'departments.department_name',
          'departments.department_id',
          'companies.company_name',
          'companies.company_id'
        )
        .where('employees.employee_id', id)
        .where('employees.is_delete', false)
      
      if (!employee) {
        return null
      }

      // Get all systems first
      const allSystems = await this.knex('systems')
        .select('system_id', 'system_name')
        .where('is_delete', false)
        .orderBy('system_name')

      // Get all menus with their system_id
      const allMenus = await this.knex('menus')
        .leftJoin('systems', 'menus.system_id', 'systems.system_id')
        .select(
          'menus.menu_id', 
          'menus.menu_name',
          'menus.system_id',
          'systems.system_name'
        )
        .where('menus.is_delete', false)
        .orderBy('menus.menu_name')

      // Get all permissions
      const allPermissions = await this.knex('permissions')
        .select('permission_id', 'permission_name')
        .where('is_delete', false)
        .orderBy('permission_name')

      // Get employee's existing permissions
      const employeePermissions = await this.knex('employeeHasPermissions')
        .select('menu_id', 'permission_id')
        .where('employee_id', id)

      // Create a set of employee permissions for quick lookup
      const employeePermissionSet = new Set()
      employeePermissions.forEach(perm => {
        employeePermissionSet.add(`${perm.menu_id}-${perm.permission_id}`)
      })

      // Group by system first, then by menu
      const systemMap = new Map()
      
      // Initialize all systems
      allSystems.forEach(system => {
        systemMap.set(system.system_id, {
          system_id: system.system_id,
          system_name: system.system_name,
          permission_detail: []
        })
      })

      // Group menus by system
      const menuMap = new Map()
      allMenus.forEach(menu => {
        if (!menuMap.has(menu.system_id)) {
          menuMap.set(menu.system_id, [])
        }
        menuMap.get(menu.system_id).push({
          menu_id: menu.menu_id,
          menu_name: menu.menu_name,
          permission_detail: []
        })
      })

      // Add all permissions to each menu
      allMenus.forEach(menu => {
        allPermissions.forEach(permission => {
          const permissionKey = `${menu.menu_id}-${permission.permission_id}`
          const hasPermission = employeePermissionSet.has(permissionKey)
          
          const menuInMap = menuMap.get(menu.system_id)?.find(m => m.menu_id === menu.menu_id)
          if (menuInMap) {
            menuInMap.permission_detail.push({
              permission_id: permission.permission_id,
              permission_name: permission.permission_name,
              permission_status: hasPermission
            })
          }
        })
      })

      // Build final structure grouped by system
      systemMap.forEach((system, systemId) => {
        const menus = menuMap.get(systemId) || []
        system.permission_detail = menus
      })

      // Convert map to array and filter out systems with no menus
      const permission_detail = Array.from(systemMap.values())
        .filter(system => system.permission_detail.length > 0)

      // Add permission_detail to employee object
      employee.permission_detail = permission_detail
      
      return employee
    } catch (error) {
      console.error('Error in getEmployeeById:', error)
      throw error
    }
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
   * Create employee permissions
   */
  async createEmployeePermissions(employeeId, permissions, createdBy) {
    if (!permissions || !Array.isArray(permissions) || permissions.length === 0) {
      return []
    }

    const permissionData = []
    
    for (const permission of permissions) {
      if (permission.menu_id && permission.permission_detail && Array.isArray(permission.permission_detail)) {
        for (const detail of permission.permission_detail) {
          if (detail.permission_id && detail.permission_status === true) {
            permissionData.push({
              employee_id: employeeId,
              menu_id: permission.menu_id,
              permission_id: detail.permission_id,
              created_by: createdBy,
              created_at: new Date()
            })
          }
        }
      }
    }

    if (permissionData.length > 0) {
      return await this.knex('employeeHasPermissions')
        .insert(permissionData)
        .returning('*')
    }

    return []
  }

  /**
   * Delete employee permissions
   */
  async deleteEmployeePermissions(employeeId) {
    return await this.knex('employeeHasPermissions')
      .where('employee_id', employeeId)
      .del()
  }

  /**
   * Update employee permissions based on permission_status
   */
  async updateEmployeePermissions(employeeId, permissions, updatedBy) {
    if (!permissions || !Array.isArray(permissions) || permissions.length === 0) {
      return { created: [], deleted: [] }
    }

    const permissionData = []
    const deleteConditions = []
    
    for (const permission of permissions) {
      // Support both old structure (direct menu_id) and new structure (with system_id)
      let menusToProcess = []
      
      if (permission.menu_id && permission.permission_detail && Array.isArray(permission.permission_detail)) {
        // Old structure: direct menu with permission_detail
        menusToProcess.push({
          menu_id: permission.menu_id,
          permission_detail: permission.permission_detail
        })
      } else if (permission.system_id && permission.permission_detail && Array.isArray(permission.permission_detail)) {
        // New structure: system with menus containing permission_detail
        menusToProcess = permission.permission_detail
      }
      
      for (const menu of menusToProcess) {
        if (menu.menu_id && menu.permission_detail && Array.isArray(menu.permission_detail)) {
          for (const detail of menu.permission_detail) {
            if (detail.permission_id) {
              if (detail.permission_status === true) {
                permissionData.push({
                  employee_id: employeeId,
                  menu_id: menu.menu_id,
                  permission_id: detail.permission_id,
                  created_by: updatedBy,
                  created_at: new Date()
                })
              } else if (detail.permission_status === false) {
                deleteConditions.push({
                  employee_id: employeeId,
                  menu_id: menu.menu_id,
                  permission_id: detail.permission_id
                })
              }
            }
          }
        }
      }
    }

    const results = { created: [], deleted: [] }

    // Delete permissions where status is false
    if (deleteConditions.length > 0) {
      for (const condition of deleteConditions) {
        const deletedRows = await this.knex('employeeHasPermissions')
          .where(condition)
          .del()
        if (deletedRows > 0) {
          results.deleted.push(condition)
        }
      }
    }

    // Insert permissions where status is true
    if (permissionData.length > 0) {
      try {
        // Insert permissions and handle duplicates gracefully
        const createdPermissions = await this.knex('employeeHasPermissions')
          .insert(permissionData)
          .returning('*')
        
        results.created = createdPermissions || []
      } catch (error) {
        if (error.code === '23505') { // Unique constraint violation
          // If duplicate, try to insert each permission individually
          const createdPermissions = []
          for (const permission of permissionData) {
            try {
              const [created] = await this.knex('employeeHasPermissions')
                .insert(permission)
                .returning('*')
              if (created) {
                createdPermissions.push(created)
              }
            } catch (duplicateError) {
              // Skip duplicates silently
              console.log(`Permission already exists for employee ${permission.employee_id}, menu ${permission.menu_id}, permission ${permission.permission_id}`)
            }
          }
          results.created = createdPermissions
        } else {
          throw error
        }
      }
    }

    return results
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
        'departments.department_id',
        'companies.company_name',
        'companies.company_id'
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

  /**
   * Reset employee password
   */
  async resetPassword(employeeId, hashedPassword) {
    const [employee] = await this.knex(this.tableName)
      .where('employee_id', employeeId)
      .where('is_delete', false)
      .update({
        password: hashedPassword,
        updated_at: new Date()
      })
      .returning('*')
    
    return employee
  }

  /**
   * Get all menus and permissions for menu permission endpoint
   */
  async getMenuPermissions() {
    try {
      // Get all menus where is_delete = false
      const menus = await this.knex('menus')
        .select('menu_id', 'menu_name')
        .where('is_delete', false)
        .orderBy('menu_name')

      // Get all permissions where is_delete = false
      const permissions = await this.knex('permissions')
        .select('permission_id', 'permission_name')
        .where('is_delete', false)
        .orderBy('permission_name')

      // Format response according to the required structure
      const permission_detail = menus.map(menu => ({
        menu_id: menu.menu_id,
        menu_name: menu.menu_name,
        permission_detail: permissions.map(permission => ({
          permission_id: permission.permission_id,
          permission_name: permission.permission_name
        }))
      }))

      return {
        permission_detail
      }
    } catch (error) {
      console.error('Error in getMenuPermissions:', error)
      throw error
    }
  }
}

module.exports = EmployeesRepository

