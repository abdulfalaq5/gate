const { systemHasMenusColumns } = require('./column');
const { applyStandardFilters, buildCountQuery, formatPaginatedResponse } = require('../../utils/query_builder');

/**
 * SystemHasMenus Repository - Database operations for systemHasMenus table
 */
class SystemHasMenusRepository {
  constructor(knex) {
    this.knex = knex
    this.tableName = 'systemHasMenus'
  }

  async findById(systemId, menuId) {
    const [record] = await this.knex(this.tableName)
      .select('*')
      .where('system_id', systemId)
      .where('menu_id', menuId)
    
    return record
  }

  async findAll() {
    return await this.knex(this.tableName)
      .select('*')
      .orderBy('created_at', 'desc')
  }

  /**
   * Find systemHasMenus dengan filter standar (pagination, sorting, searching, filtering)
   * @param {Object} queryParams - Parsed query parameters dari parseStandardQuery
   * @returns {Object} Paginated response dengan data dan metadata
   */
  async findWithFilters(queryParams) {
    // Base query untuk data dengan join ke tabel systems dan menus
    const baseQuery = this.knex(this.tableName)
      .select(
        'shm.*',
        's.system_name',
        'm.menu_name',
        'm.menu_url'
      )
      .leftJoin('systems as s', 'shm.system_id', 's.system_id')
      .leftJoin('menus as m', 'shm.menu_id', 'm.menu_id');

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
   * Find systemHasMenus dengan filter sederhana (tanpa pagination)
   * @param {Object} filters - Filter parameters
   * @returns {Array} Array of systemHasMenus
   */
  async findWithSimpleFilters(filters = {}) {
    let query = this.knex(this.tableName)
      .select(
        'shm.*',
        's.system_name',
        'm.menu_name',
        'm.menu_url'
      )
      .leftJoin('systems as s', 'shm.system_id', 's.system_id')
      .leftJoin('menus as m', 'shm.menu_id', 'm.menu_id');

    // Apply filters
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== '') {
        query = query.where(`shm.${key}`, filters[key]);
      }
    });

    return await query.orderBy('shm.created_at', 'desc');
  }

  async findBySystemId(systemId) {
    return await this.knex(this.tableName)
      .select(
        'shm.*',
        'm.menu_name',
        'm.menu_url'
      )
      .leftJoin('menus as m', 'shm.menu_id', 'm.menu_id')
      .where('shm.system_id', systemId)
      .orderBy('shm.created_at', 'desc')
  }

  async findByMenuId(menuId) {
    return await this.knex(this.tableName)
      .select(
        'shm.*',
        's.system_name'
      )
      .leftJoin('systems as s', 'shm.system_id', 's.system_id')
      .where('shm.menu_id', menuId)
      .orderBy('shm.created_at', 'desc')
  }

  async createSystemHasMenu(data) {
    const [record] = await this.knex(this.tableName)
      .insert({
        ...data,
        created_at: new Date()
      })
      .returning('*')
    
    return record
  }

  async updateSystemHasMenu(systemId, menuId, data) {
    const [record] = await this.knex(this.tableName)
      .where('system_id', systemId)
      .where('menu_id', menuId)
      .update({
        ...data,
        updated_at: new Date()
      })
      .returning('*')
    
    return record
  }

  async deleteSystemHasMenu(systemId, menuId) {
    const [record] = await this.knex(this.tableName)
      .where('system_id', systemId)
      .where('menu_id', menuId)
      .del()
      .returning('*')
    
    return record
  }

  async deleteBySystemId(systemId) {
    return await this.knex(this.tableName)
      .where('system_id', systemId)
      .del()
      .returning('*')
  }

  async deleteByMenuId(menuId) {
    return await this.knex(this.tableName)
      .where('menu_id', menuId)
      .del()
      .returning('*')
  }
}

module.exports = SystemHasMenusRepository;
