const { menusColumns } = require('./column');

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