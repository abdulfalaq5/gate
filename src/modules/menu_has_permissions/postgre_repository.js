const { menuHasPermissionsColumns } = require('./column');
const { applyStandardFilters, buildCountQuery, formatPaginatedResponse } = require('../../utils/query_builder');

/**
 * MenuHasPermissions Repository - Database operations for menuHasPermissions table
 */
class MenuHasPermissionsRepository {
  constructor(knex) {
    this.knex = knex
    this.tableName = 'menuHasPermissions'
  }

  async findById(menuId, permissionId) {
    const [record] = await this.knex(this.tableName)
      .select('*')
      .where('menu_id', menuId)
      .where('permission_id', permissionId)
    
    return record
  }

  async findAll() {
    return await this.knex(this.tableName)
      .select('*')
      .orderBy('created_at', 'desc')
  }

  /**
   * Find menuHasPermissions dengan filter standar (pagination, sorting, searching, filtering)
   * @param {Object} queryParams - Parsed query parameters dari parseStandardQuery
   * @returns {Object} Paginated response dengan data dan metadata
   */
  async findWithFilters(queryParams) {
    // Base query untuk data dengan join ke tabel menus dan permissions
    const baseQuery = this.knex(this.tableName)
      .select(
        'mhp.*',
        'm.menu_name',
        'm.menu_url',
        'p.permission_name'
      )
      .leftJoin('menus as m', 'mhp.menu_id', 'm.menu_id')
      .leftJoin('permissions as p', 'mhp.permission_id', 'p.permission_id');

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
   * Find menuHasPermissions dengan filter sederhana (tanpa pagination)
   * @param {Object} filters - Filter parameters
   * @returns {Array} Array of menuHasPermissions
   */
  async findWithSimpleFilters(filters = {}) {
    let query = this.knex(this.tableName)
      .select(
        'mhp.*',
        'm.menu_name',
        'm.menu_url',
        'p.permission_name'
      )
      .leftJoin('menus as m', 'mhp.menu_id', 'm.menu_id')
      .leftJoin('permissions as p', 'mhp.permission_id', 'p.permission_id');

    // Apply filters
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== '') {
        query = query.where(`mhp.${key}`, filters[key]);
      }
    });

    return await query.orderBy('mhp.created_at', 'desc');
  }

  async findByMenuId(menuId) {
    return await this.knex(this.tableName)
      .select(
        'mhp.*',
        'p.permission_name'
      )
      .leftJoin('permissions as p', 'mhp.permission_id', 'p.permission_id')
      .where('mhp.menu_id', menuId)
      .orderBy('mhp.created_at', 'desc')
  }

  async findByPermissionId(permissionId) {
    return await this.knex(this.tableName)
      .select(
        'mhp.*',
        'm.menu_name',
        'm.menu_url'
      )
      .leftJoin('menus as m', 'mhp.menu_id', 'm.menu_id')
      .where('mhp.permission_id', permissionId)
      .orderBy('mhp.created_at', 'desc')
  }

  async createMenuHasPermission(data) {
    const [record] = await this.knex(this.tableName)
      .insert({
        ...data,
        created_at: new Date()
      })
      .returning('*')
    
    return record
  }

  async updateMenuHasPermission(menuId, permissionId, data) {
    const [record] = await this.knex(this.tableName)
      .where('menu_id', menuId)
      .where('permission_id', permissionId)
      .update({
        ...data,
        updated_at: new Date()
      })
      .returning('*')
    
    return record
  }

  async deleteMenuHasPermission(menuId, permissionId) {
    const [record] = await this.knex(this.tableName)
      .where('menu_id', menuId)
      .where('permission_id', permissionId)
      .del()
      .returning('*')
    
    return record
  }

  async deleteByMenuId(menuId) {
    return await this.knex(this.tableName)
      .where('menu_id', menuId)
      .del()
      .returning('*')
  }

  async deleteByPermissionId(permissionId) {
    return await this.knex(this.tableName)
      .where('permission_id', permissionId)
      .del()
      .returning('*')
  }
}

module.exports = MenuHasPermissionsRepository;
