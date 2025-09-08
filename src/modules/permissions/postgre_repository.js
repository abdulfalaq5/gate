const { permissionsColumns } = require('./column');
const { applyStandardFilters, buildCountQuery, formatPaginatedResponse } = require('../../utils/query_builder');

/**
 * Permissions Repository - Database operations for permissions table
 */
class PermissionsRepository {
  constructor(knex) {
    this.knex = knex
    this.tableName = 'permissions'
  }

  async findById(permissionId) {
    const [permission] = await this.knex(this.tableName)
      .select('*')
      .where('permission_id', permissionId)
      .where('is_delete', false)
    
    return permission
  }

  async findAllActive() {
    return await this.knex(this.tableName)
      .select('*')
      .where('is_delete', false)
      .orderBy('created_at', 'desc')
  }

  /**
   * Find permissions dengan filter standar (pagination, sorting, searching, filtering)
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
   * Find permissions dengan filter sederhana (tanpa pagination)
   * @param {Object} filters - Filter parameters
   * @returns {Array} Array of permissions
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

  async createPermission(data) {
    const [permission] = await this.knex(this.tableName)
      .insert({
        ...data,
        created_at: new Date()
      })
      .returning('*')
    
    return permission
  }

  async updatePermission(permissionId, data) {
    const [permission] = await this.knex(this.tableName)
      .where('permission_id', permissionId)
      .update({
        ...data,
        updated_at: new Date()
      })
      .returning('*')
    
    return permission
  }

  async deletePermission(permissionId, deletedBy) {
    const [permission] = await this.knex(this.tableName)
      .where('permission_id', permissionId)
      .update({
        is_delete: true,
        deleted_at: new Date(),
        deleted_by: deletedBy
      })
      .returning('*')
    
    return permission
  }

  async restorePermission(permissionId, updatedBy) {
    const [permission] = await this.knex(this.tableName)
      .where('permission_id', permissionId)
      .update({
        is_delete: false,
        deleted_at: null,
        deleted_by: null,
        updated_at: new Date(),
        updated_by: updatedBy
      })
      .returning('*')
    
    return permission
  }
}

module.exports = PermissionsRepository;