const MenusRepository = require('./postgre_repository');
const { successResponse, errorResponse } = require('../../utils/response');
const { pgCore } = require('../../config/database');
const { parseStandardQuery } = require('../../utils/pagination');

class MenusHandler {
  constructor() {
    this.menusRepository = new MenusRepository(pgCore);
  }

  async createMenu(req, res) {
    try {
      // Support parameters from both query string (GET) and body (POST)
      const requestParams = {
        ...req.query,  // GET parameters
        ...req.body    // POST parameters
      };
      
      const { menu_name, menu_parent_id, menu_url, menu_icon, menu_order, system_id } = requestParams;
      const createdBy = req.user?.user_id;

      if (!menu_name) {
        return errorResponse(res, 'Menu name is required', 400);
      }

      const menuData = {
        menu_name,
        menu_parent_id: menu_parent_id === '' ? null : menu_parent_id,
        menu_url,
        menu_icon,
        menu_order: menu_order ? parseInt(menu_order) : undefined,
        system_id: system_id === '' ? null : system_id,
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
      // Support parameters from both query string (GET) and body (POST)
      const requestParams = {
        ...req.query,  // GET parameters
        ...req.body    // POST parameters
      };
      
      // Create a modified request object for parseStandardQuery
      const modifiedReq = {
        ...req,
        query: requestParams
      };

      // Parse query parameters dengan konfigurasi untuk menus
      const queryParams = parseStandardQuery(modifiedReq, {
        allowedSortColumns: ['menu_name', 'menu_order', 'created_at', 'updated_at'],
        defaultSort: ['created_at', 'desc'],
        searchableColumns: ['menu_name', 'menu_url'],
        allowedFilters: [
          'menu_name', 
          'menu_url', 
          'menu_icon', 
          'menu_parent_id',
          'menu_order',
          'system_id',
          'created_by',
          'updated_by',
          'is_delete'
        ],
        dateColumn: 'created_at'
      });

      // Gunakan method baru dengan filter standar
      const result = await this.menusRepository.findWithFilters(queryParams);

      return successResponse(res, result, 'Menus retrieved successfully');
    } catch (error) {
      console.error('Error listing menus:', error);
      return errorResponse(res, 'Failed to retrieve menus', 500);
    }
  }

  async getMenuTree(req, res) {
    try {
      // Support parameters from both query string (GET) and body (POST)
      const requestParams = {
        ...req.query,  // GET parameters
        ...req.body    // POST parameters
      };
      
      // Untuk menu tree, kita tidak perlu pagination, hanya filter sederhana
      const filters = {};
      
      // Parse filter sederhana dari requestParams
      if (requestParams.menu_name) filters.menu_name = requestParams.menu_name;
      if (requestParams.menu_url) filters.menu_url = requestParams.menu_url;
      
      const menus = await this.menusRepository.findWithSimpleFilters(filters);
      
      return successResponse(res, menus, 'Menu tree retrieved successfully');
    } catch (error) {
      console.error('Error getting menu tree:', error);
      return errorResponse(res, 'Failed to retrieve menu tree', 500);
    }
  }

  async updateMenu(req, res) {
    try {
      const { id } = req.params;
      const { menu_name, menu_parent_id, menu_url, menu_icon, menu_order, system_id } = req.body;
      const updatedBy = req.user?.user_id;

      const menu = await this.menusRepository.findById(id);

      if (!menu) {
        return errorResponse(res, 'Menu not found', 404);
      }

      const updateData = {
        updated_by: updatedBy,
      };

      if (menu_name) updateData.menu_name = menu_name;
      if (menu_parent_id !== undefined) updateData.menu_parent_id = menu_parent_id === '' ? null : menu_parent_id;
      if (menu_url) updateData.menu_url = menu_url;
      if (menu_icon) updateData.menu_icon = menu_icon;
      if (menu_order) updateData.menu_order = menu_order;
      if (system_id !== undefined) updateData.system_id = system_id === '' ? null : system_id;

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