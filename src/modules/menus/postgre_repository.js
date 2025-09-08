const menusColumns = require('./column');
const { applyStandardFilters, buildCountQuery, formatPaginatedResponse } = require('../../utils/query_builder');

/**
 * Menus Repository - Database operations for menus table
 */
class MenusRepository {
  constructor(knex) {
    this.knex = knex
    this.tableName = 'menus'
  }

  async findById(menuId) {
    const [menu] = await this.knex(this.tableName)
      .select('*')
      .where('menu_id', menuId)
      .where('is_delete', false)
    
    return menu
  }

  async findAllActive() {
    return await this.knex(this.tableName)
      .select('*')
      .where('is_delete', false)
      .orderBy('created_at', 'desc')
  }

  /**
   * Find menus dengan filter standar (pagination, sorting, searching, filtering)
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
   * Find menus dengan filter sederhana (tanpa pagination)
   * @param {Object} filters - Filter parameters
   * @returns {Array} Array of menus
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

  async createMenu(data) {
    const [menu] = await this.knex(this.tableName)
      .insert({
        ...data,
        created_at: new Date()
      })
      .returning('*')
    
    return menu
  }

  async updateMenu(menuId, data) {
    const [menu] = await this.knex(this.tableName)
      .where('menu_id', menuId)
      .update({
        ...data,
        updated_at: new Date()
      })
      .returning('*')
    
    return menu
  }

  async deleteMenu(menuId, deletedBy) {
    const [menu] = await this.knex(this.tableName)
      .where('menu_id', menuId)
      .update({
        is_delete: true,
        deleted_at: new Date(),
        deleted_by: deletedBy
      })
      .returning('*')
    
    return menu
  }

  async restoreMenu(menuId, updatedBy) {
    const [menu] = await this.knex(this.tableName)
      .where('menu_id', menuId)
      .update({
        is_delete: false,
        deleted_at: null,
        deleted_by: null,
        updated_at: new Date(),
        updated_by: updatedBy
      })
      .returning('*')
    
    return menu
  }
}

module.exports = MenusRepository;