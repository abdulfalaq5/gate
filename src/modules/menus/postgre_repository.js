const { menusColumns } = require('./column');
const { CorePostgres } = require('../../../repository/postgres/core_postgres');

class MenusRepository extends CorePostgres {
  constructor() {
    super('menus', menusColumns);
  }

  async findById(menuId) {
    return await this.findOne({ menu_id: menuId, is_delete: false });
  }

  async findAllActive() {
    return await this.findMany({ is_delete: false });
  }

  async findChildren(parentId) {
    return await this.findMany({ menu_parent_id: parentId, is_delete: false });
  }

  async findRootMenus() {
    return await this.findMany({ menu_parent_id: null, is_delete: false });
  }

  async createMenu(data) {
    return await this.create(data);
  }

  async updateMenu(menuId, data) {
    return await this.update({ menu_id: menuId }, data);
  }

  async deleteMenu(menuId, deletedBy) {
    return await this.update(
      { menu_id: menuId },
      { 
        is_delete: true, 
        deleted_at: new Date(), 
        deleted_by: deletedBy 
      }
    );
  }

  async restoreMenu(menuId, updatedBy) {
    return await this.update(
      { menu_id: menuId },
      { 
        is_delete: false, 
        deleted_at: null, 
        deleted_by: null,
        updated_at: new Date(),
        updated_by: updatedBy
      }
    );
  }

  async getMenuTree() {
    const menus = await this.findAllActive();
    return this.buildMenuTree(menus);
  }

  buildMenuTree(menus, parentId = null) {
    return menus
      .filter(menu => menu.menu_parent_id === parentId)
      .map(menu => ({
        ...menu,
        children: this.buildMenuTree(menus, menu.menu_id)
      }))
      .sort((a, b) => a.menu_order - b.menu_order);
  }
}

module.exports = MenusRepository;
