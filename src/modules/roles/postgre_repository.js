const { rolesColumns } = require('./column');
const { applyStandardFilters, buildCountQuery, formatPaginatedResponse } = require('../../utils/query_builder');

/**
 * Roles Repository - Database operations for roles table
 */
class RolesRepository {
  constructor(knex) {
    this.knex = knex
    this.tableName = 'roles'
  }

  async findById(roleId) {
    const [role] = await this.knex(this.tableName)
      .select('*')
      .where('role_id', roleId)
      .where('is_delete', false)
    
    return role
  }

  async findAllActive() {
    return await this.knex(this.tableName)
      .select('*')
      .where('is_delete', false)
      .orderBy('created_at', 'desc')
  }

  /**
   * Find roles dengan filter standar (pagination, sorting, searching, filtering)
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
   * Find roles dengan filter sederhana (tanpa pagination)
   * @param {Object} filters - Filter parameters
   * @returns {Array} Array of roles
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

  async createRole(data) {
    const [role] = await this.knex(this.tableName)
      .insert({
        ...data,
        created_at: new Date()
      })
      .returning('*')
    
    return role
  }

  async updateRole(roleId, data) {
    const [role] = await this.knex(this.tableName)
      .where('role_id', roleId)
      .update({
        ...data,
        updated_at: new Date()
      })
      .returning('*')
    
    return role
  }

  async deleteRole(roleId, deletedBy) {
    const [role] = await this.knex(this.tableName)
      .where('role_id', roleId)
      .update({
        is_delete: true,
        deleted_at: new Date(),
        deleted_by: deletedBy
      })
      .returning('*')
    
    return role
  }
}

module.exports = RolesRepository;