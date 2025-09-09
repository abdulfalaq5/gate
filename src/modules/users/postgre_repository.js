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
        'employees.employee_name'
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
    // Base query untuk data
    const baseQuery = this.knex(this.tableName)
      .select('*')
      .where('is_delete', false);

    // Query untuk count total records
    const countQuery = buildCountQuery(baseQuery, queryParams);
    const [{ total }] = await countQuery;

    // Apply filters dan pagination ke base query
    const dataQuery = applyStandardFilters(baseQuery.clone(), queryParams);
    const data = await dataQuery;

    // Format response dengan pagination metadata
    return formatPaginatedResponse(data, queryParams.pagination, total);
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