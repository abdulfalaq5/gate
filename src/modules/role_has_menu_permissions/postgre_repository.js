const { roleHasMenuPermissionsColumns } = require('./column');
const { applyStandardFilters, buildCountQuery, formatPaginatedResponse } = require('../../utils/query_builder');

/**
 * RoleHasMenuPermissions Repository - Database operations for roleHasMenuPermissions table
 */
class RoleHasMenuPermissionsRepository {
  constructor(knex) {
    this.knex = knex
    this.tableName = 'roleHasMenuPermissions'
  }

  async findById(roleId, menuId, permissionId) {
    const [record] = await this.knex(this.tableName)
      .select('*')
      .where('role_id', roleId)
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
   * Find roleHasMenuPermissions dengan filter standar (pagination, sorting, searching, filtering)
   * @param {Object} queryParams - Parsed query parameters dari parseStandardQuery
   * @returns {Object} Paginated response dengan data dan metadata
   */
  async findWithFilters(queryParams) {
    // Base query untuk data dengan join ke tabel roles, menus, dan permissions
    const baseQuery = this.knex(`${this.tableName} as rhmp`)
      .select(
        'rhmp.*',
        'r.role_name',
        'm.menu_name',
        'm.menu_url',
        'p.permission_name'
      )
      .leftJoin('roles as r', 'rhmp.role_id', 'r.role_id')
      .leftJoin('menus as m', 'rhmp.menu_id', 'm.menu_id')
      .leftJoin('permissions as p', 'rhmp.permission_id', 'p.permission_id');

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
   * Find roleHasMenuPermissions dengan filter sederhana (tanpa pagination)
   * @param {Object} filters - Filter parameters
   * @returns {Array} Array of roleHasMenuPermissions
   */
  async findWithSimpleFilters(filters = {}) {
    let query = this.knex(`${this.tableName} as rhmp`)
      .select(
        'rhmp.*',
        'r.role_name',
        'm.menu_name',
        'm.menu_url',
        'p.permission_name'
      )
      .leftJoin('roles as r', 'rhmp.role_id', 'r.role_id')
      .leftJoin('menus as m', 'rhmp.menu_id', 'm.menu_id')
      .leftJoin('permissions as p', 'rhmp.permission_id', 'p.permission_id');

    // Apply filters
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== '') {
        query = query.where(`rhmp.${key}`, filters[key]);
      }
    });

    return await query.orderBy('rhmp.created_at', 'desc');
  }

  async findByRoleId(roleId) {
    return await this.knex(this.tableName)
      .select(
        'rhmp.*',
        'm.menu_name',
        'm.menu_url',
        'p.permission_name'
      )
      .leftJoin('menus as m', 'rhmp.menu_id', 'm.menu_id')
      .leftJoin('permissions as p', 'rhmp.permission_id', 'p.permission_id')
      .where('rhmp.role_id', roleId)
      .orderBy('rhmp.created_at', 'desc')
  }

  async findByMenuId(menuId) {
    return await this.knex(this.tableName)
      .select(
        'rhmp.*',
        'r.role_name',
        'p.permission_name'
      )
      .leftJoin('roles as r', 'rhmp.role_id', 'r.role_id')
      .leftJoin('permissions as p', 'rhmp.permission_id', 'p.permission_id')
      .where('rhmp.menu_id', menuId)
      .orderBy('rhmp.created_at', 'desc')
  }

  async findByPermissionId(permissionId) {
    return await this.knex(this.tableName)
      .select(
        'rhmp.*',
        'r.role_name',
        'm.menu_name',
        'm.menu_url'
      )
      .leftJoin('roles as r', 'rhmp.role_id', 'r.role_id')
      .leftJoin('menus as m', 'rhmp.menu_id', 'm.menu_id')
      .where('rhmp.permission_id', permissionId)
      .orderBy('rhmp.created_at', 'desc')
  }

  async findByRoleAndMenu(roleId, menuId) {
    return await this.knex(this.tableName)
      .select(
        'rhmp.*',
        'p.permission_name'
      )
      .leftJoin('permissions as p', 'rhmp.permission_id', 'p.permission_id')
      .where('rhmp.role_id', roleId)
      .where('rhmp.menu_id', menuId)
      .orderBy('rhmp.created_at', 'desc')
  }

  async createRoleHasMenuPermission(data) {
    const [record] = await this.knex(this.tableName)
      .insert({
        ...data,
        created_at: new Date()
      })
      .returning('*')
    
    return record
  }

  async updateRoleHasMenuPermission(roleId, menuId, permissionId, data) {
    const [record] = await this.knex(this.tableName)
      .where('role_id', roleId)
      .where('menu_id', menuId)
      .where('permission_id', permissionId)
      .update({
        ...data,
        updated_at: new Date()
      })
      .returning('*')
    
    return record
  }

  async deleteRoleHasMenuPermission(roleId, menuId, permissionId) {
    const [record] = await this.knex(this.tableName)
      .where('role_id', roleId)
      .where('menu_id', menuId)
      .where('permission_id', permissionId)
      .del()
      .returning('*')
    
    return record
  }

  async deleteByRoleId(roleId) {
    return await this.knex(this.tableName)
      .where('role_id', roleId)
      .del()
      .returning('*')
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

  async deleteByRoleAndMenu(roleId, menuId) {
    return await this.knex(this.tableName)
      .where('role_id', roleId)
      .where('menu_id', menuId)
      .del()
      .returning('*')
  }

  /**
   * Get all menus with their permissions and status for a specific role
   * @param {string} roleId - Role ID
   * @returns {Array} Array of menus with permissions and their status
   */
  async getMenusWithPermissionsForRole(roleId) {
    // Get all menus with their available permissions
    const menusWithPermissions = await this.knex('menus as m')
      .select(
        'm.menu_id',
        'm.menu_name',
        'p.permission_id',
        'p.permission_name'
      )
      .leftJoin('menuHasPermissions as mhp', 'm.menu_id', 'mhp.menu_id')
      .leftJoin('permissions as p', 'mhp.permission_id', 'p.permission_id')
      .where('m.is_delete', false)
      .where('p.is_delete', false)
      .orderBy('m.menu_name', 'asc')
      .orderBy('p.permission_name', 'asc');

    // Get existing role-menu-permission relationships
    const existingPermissions = await this.knex(this.tableName)
      .select('menu_id', 'permission_id')
      .where('role_id', roleId);

    // Create a Set for faster lookup
    const existingPermissionsSet = new Set(
      existingPermissions.map(perm => `${perm.menu_id}-${perm.permission_id}`)
    );

    // Group by menu and format the response
    const menuMap = new Map();
    
    menusWithPermissions.forEach(row => {
      if (!row.permission_id) return; // Skip menus without permissions
      
      const menuKey = row.menu_id;
      if (!menuMap.has(menuKey)) {
        menuMap.set(menuKey, {
          role_id: roleId,
          menu_id: row.menu_id,
          menu_name: row.menu_name,
          permissions: []
        });
      }
      
      const permissionKey = `${row.menu_id}-${row.permission_id}`;
      const permissionStatus = existingPermissionsSet.has(permissionKey);
      
      menuMap.get(menuKey).permissions.push({
        permission_id: row.permission_id,
        permission_name: row.permission_name,
        permission_status: permissionStatus
      });
    });

    return Array.from(menuMap.values());
  }
}

module.exports = RoleHasMenuPermissionsRepository;
