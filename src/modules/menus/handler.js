const MenusRepository = require('./postgre_repository');
const { successResponse, errorResponse } = require('../../utils/response');

class MenusHandler {
  constructor() {
    this.menusRepository = new MenusRepository(require('../../repository/postgres/core_postgres'));
  }

  async createMenu(req, res) {
    try {
      const { menu_name, menu_url, menu_icon, menu_order } = req.body;
      const createdBy = req.user?.user_id;

      if (!menu_name) {
        return errorResponse(res, 'Menu name is required', 400);
      }

      const menuData = {
        menu_name,
        menu_url,
        menu_icon,
        menu_order,
        created_by: createdBy,
      };

      const menu = await this.menusRepository.createMenu(menuData);

      return successResponse(res, menu, 'Menu created successfully', 201);
    } catch (error) {
      console.error('Error creating menu:', error);
      return errorResponse(res, 'Failed to create menu', 500);
    }
  }

  async getMenu(req, res) {
    try {
      const { id } = req.params;

      const menu = await this.menusRepository.findById(id);

      if (!menu) {
        return errorResponse(res, 'Menu not found', 404);
      }

      return successResponse(res, menu, 'Menu retrieved successfully');
    } catch (error) {
      console.error('Error getting menu:', error);
      return errorResponse(res, 'Failed to retrieve menu', 500);
    }
  }

  async listMenus(req, res) {
    try {
      const menus = await this.menusRepository.findAllActive();

      return successResponse(res, menus, 'Menus retrieved successfully');
    } catch (error) {
      console.error('Error listing menus:', error);
      return errorResponse(res, 'Failed to retrieve menus', 500);
    }
  }

  async getMenuTree(req, res) {
    try {
      const menus = await this.menusRepository.findAllActive();
      // Simple tree structure - bisa dikembangkan lebih lanjut
      return successResponse(res, menus, 'Menu tree retrieved successfully');
    } catch (error) {
      console.error('Error getting menu tree:', error);
      return errorResponse(res, 'Failed to retrieve menu tree', 500);
    }
  }

  async updateMenu(req, res) {
    try {
      const { id } = req.params;
      const { menu_name, menu_url, menu_icon, menu_order } = req.body;
      const updatedBy = req.user?.user_id;

      const menu = await this.menusRepository.findById(id);

      if (!menu) {
        return errorResponse(res, 'Menu not found', 404);
      }

      const updateData = {
        updated_by: updatedBy,
      };

      if (menu_name) updateData.menu_name = menu_name;
      if (menu_url) updateData.menu_url = menu_url;
      if (menu_icon) updateData.menu_icon = menu_icon;
      if (menu_order) updateData.menu_order = menu_order;

      const updatedMenu = await this.menusRepository.updateMenu(id, updateData);

      return successResponse(res, updatedMenu, 'Menu updated successfully');
    } catch (error) {
      console.error('Error updating menu:', error);
      return errorResponse(res, 'Failed to update menu', 500);
    }
  }

  async deleteMenu(req, res) {
    try {
      const { id } = req.params;
      const deletedBy = req.user?.user_id;

      const menu = await this.menusRepository.findById(id);

      if (!menu) {
        return errorResponse(res, 'Menu not found', 404);
      }

      await this.menusRepository.deleteMenu(id, deletedBy);

      return successResponse(res, null, 'Menu deleted successfully');
    } catch (error) {
      console.error('Error deleting menu:', error);
      return errorResponse(res, 'Failed to delete menu', 500);
    }
  }
}

module.exports = new MenusHandler();