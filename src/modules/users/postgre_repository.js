const { usersColumns } = require('./column');
const { applyStandardFilters, buildCountQuery, formatPaginatedResponse } = require('../../utils/query_builder');

/**
 * Users Repository - Database operations for users table
 */
class UsersRepository {
  constructor(knex) {
    this.knex = knex
    this.tableName = 'users'
  }

  async findById(userId) {
    const [user] = await this.knex(this.tableName)
      .select('*')
      .where('user_id', userId)
      .where('is_delete', false)
    
    return user
  }

  async findByEmail(email) {
    const [user] = await this.knex(this.tableName)
      .select('*')
      .where('user_email', email)
      .where('is_delete', false)
    
    return user
  }

  async findByUsername(username) {
    const [user] = await this.knex(this.tableName)
      .select('*')
      .where('user_name', username)
      .where('is_delete', false)
    
    return user
  }

  async verifyPassword(plainPassword, hashedPassword) {
    const bcrypt = require('bcrypt');
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async getUserWithDetails(userId) {
    const [user] = await this.knex(this.tableName)
      .select(
        'users.*',
        'roles.role_name',
        'employees.employee_name',
        'employees.employee_email',
        'employees.title_id'
      )
      .leftJoin('roles', 'users.role_id', 'roles.role_id')
      .leftJoin('employees', 'users.employee_id', 'employees.employee_id')
      .where('users.user_id', userId)
      .where('users.is_delete', false)
    
    return user
  }

  async getUserPermissions(userId) {
    const permissions = await this.knex('roleHasMenuPermissions')
      .select(
        'permissions.permission_id',
        'permissions.permission_name',
        'menus.menu_id',
        'menus.menu_name',
        'menus.menu_url'
      )
      .leftJoin('permissions', 'roleHasMenuPermissions.permission_id', 'permissions.permission_id')
      .leftJoin('menus', 'roleHasMenuPermissions.menu_id', 'menus.menu_id')
      .leftJoin('users', 'roleHasMenuPermissions.role_id', 'users.role_id')
      .where('users.user_id', userId)
      .where('permissions.is_delete', false)
      .where('menus.is_delete', false)
    
    return permissions
  }

  /**
   * Find users dengan filter standar (pagination, sorting, searching, filtering)
   * @param {Object} queryParams - Parsed query parameters dari parseStandardQuery
   * @returns {Object} Paginated response dengan data dan metadata
   */
  async findWithFilters(queryParams) {
    // Base query untuk users dengan JOIN ke employees
    const baseQuery = this.knex(this.tableName)
      .leftJoin('employees', 'users.employee_id', 'employees.employee_id')
      .select(
        'users.*',
        'employees.employee_name',
        'employees.employee_email'
      )
      .where('users.is_delete', false);

    // Pisahkan filter relasi dari filter standar
    const { filters } = queryParams
    const relationFilters = {}
    const standardFilters = {}
    
    Object.keys(filters).forEach(key => {
      if (['employee_name', 'employee_email'].includes(key)) {
        relationFilters[key] = filters[key]
      } else {
        standardFilters[key] = filters[key]
      }
    })
    
    // Update queryParams untuk filter standar
    const modifiedQueryParams = {
      ...queryParams,
      filters: standardFilters
    }

    // Apply filter standar (tanpa relasi)
    let dataQuery = applyStandardFilters(baseQuery.clone(), modifiedQueryParams)
    
    // Apply filter relasi secara manual
    if (relationFilters.employee_name) {
      dataQuery = dataQuery.where('employees.employee_name', 'ilike', `%${relationFilters.employee_name}%`)
    }
    if (relationFilters.employee_email) {
      dataQuery = dataQuery.where('employees.employee_email', 'ilike', `%${relationFilters.employee_email}%`)
    }

    // Build count query untuk pagination metadata dengan filter relasi yang sama
    let countBaseQuery = this.knex(this.tableName)
      .leftJoin('employees', 'users.employee_id', 'employees.employee_id')
      .select('*')
      .where('users.is_delete', false);
    
    let countQuery = buildCountQuery(countBaseQuery, modifiedQueryParams)
    
    // Apply filter relasi ke count query juga
    if (relationFilters.employee_name) {
      countQuery = countQuery.where('employees.employee_name', 'ilike', `%${relationFilters.employee_name}%`)
    }
    if (relationFilters.employee_email) {
      countQuery = countQuery.where('employees.employee_email', 'ilike', `%${relationFilters.employee_email}%`)
    }

    // Execute queries secara parallel
    const [data, countResult] = await Promise.all([
      dataQuery,
      countQuery.first()
    ])

    // Format response dengan pagination metadata
    return formatPaginatedResponse(data, queryParams.pagination, countResult.total);
  }

  /**
   * Find users dengan filter sederhana (tanpa pagination)
   * @param {Object} filters - Filter parameters
   * @returns {Array} Array of users
   */
  async findWithSimpleFilters(filters = {}) {
    let query = this.knex(this.tableName)
      .select('*')
      .where('is_delete', false);

    // Apply filters
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== '') {
        query = query.where(key, filters[key]);
      }
    });

    return await query.orderBy('created_at', 'desc');
  }

  async createUser(data) {
    const [user] = await this.knex(this.tableName)
      .insert({
        ...data,
        created_at: new Date()
      })
      .returning('*')
    
    return user
  }

  async updateUser(userId, data) {
    const [user] = await this.knex(this.tableName)
      .where('user_id', userId)
      .update({
        ...data,
        updated_at: new Date()
      })
      .returning('*')
    
    return user
  }

  async deleteUser(userId, deletedBy) {
    const [user] = await this.knex(this.tableName)
      .where('user_id', userId)
      .update({
        is_delete: true,
        deleted_at: new Date(),
        deleted_by: deletedBy
      })
      .returning('*')
    
    return user
  }
}

module.exports = UsersRepository;