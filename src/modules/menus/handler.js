const MenusRepository = require('./postgre_repository');
const { CustomException } = require('../../utils/exception');
const { logger } = require('../../utils/logger');

class MenusHandler {
  constructor() {
    this.menusRepository = new MenusRepository();
  }

  async createMenu(req, res) {
    try {
      const { menu_name, menu_parent_id, menu_url, menu_icon, menu_order } = req.body;
      const createdBy = req.user?.user_id;

      // Check if parent menu exists (if provided)
      if (menu_parent_id) {
        const parentMenu = await this.menusRepository.findById(menu_parent_id);
        if (!parentMenu) {
          throw new CustomException('Parent menu not found', 404);
        }
      }

      // Check if menu name already exists
      const existingMenu = await this.menusRepository.findOne({
        menu_name,
        is_delete: false
      });

      if (existingMenu) {
        throw new CustomException('Menu name already exists', 400);
      }

      const menuData = {
        menu_name,
        menu_parent_id: menu_parent_id || null,
        menu_url: menu_url || null,
        menu_icon: menu_icon || 'far fa-circle nav-icon',
        menu_order: menu_order || 0,
        created_by: createdBy,
      };

      const menu = await this.menusRepository.createMenu(menuData);

      logger.info('Menu created successfully', { menu_id: menu.menu_id });

      return res.status(201).json({
        success: true,
        message: 'Menu created successfully',
        data: menu,
      });
    } catch (error) {
      logger.error('Error creating menu:', error);
      throw error;
    }
  }

  async getMenu(req, res) {
    try {
      const { id } = req.params;

      const menu = await this.menusRepository.findById(id);

      if (!menu) {
        throw new CustomException('Menu not found', 404);
      }

      return res.status(200).json({
        success: true,
        message: 'Menu retrieved successfully',
        data: menu,
      });
    } catch (error) {
      logger.error('Error getting menu:', error);
      throw error;
    }
  }

  async listMenus(req, res) {
    try {
      const { page = 1, limit = 10, search, parent_id } = req.query;
      const offset = (page - 1) * limit;

      let whereCondition = { is_delete: false };

      if (search) {
        whereCondition.menu_name = {
          $ilike: `%${search}%`
        };
      }

      if (parent_id) {
        whereCondition.menu_parent_id = parent_id;
      }

      const menus = await this.menusRepository.findMany(whereCondition, {
        limit: parseInt(limit),
        offset: parseInt(offset),
        orderBy: 'menu_order',
        orderDirection: 'asc'
      });

      const total = await this.menusRepository.count(whereCondition);

      return res.status(200).json({
        success: true,
        message: 'Menus retrieved successfully',
        data: {
          menus,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      logger.error('Error listing menus:', error);
      throw error;
    }
  }

  async getMenuTree(req, res) {
    try {
      const menuTree = await this.menusRepository.getMenuTree();

      return res.status(200).json({
        success: true,
        message: 'Menu tree retrieved successfully',
        data: menuTree,
      });
    } catch (error) {
      logger.error('Error getting menu tree:', error);
      throw error;
    }
  }

  async updateMenu(req, res) {
    try {
      const { id } = req.params;
      const { menu_name, menu_parent_id, menu_url, menu_icon, menu_order } = req.body;
      const updatedBy = req.user?.user_id;

      const menu = await this.menusRepository.findById(id);

      if (!menu) {
        throw new CustomException('Menu not found', 404);
      }

      // Check if parent menu exists (if provided)
      if (menu_parent_id) {
        const parentMenu = await this.menusRepository.findById(menu_parent_id);
        if (!parentMenu) {
          throw new CustomException('Parent menu not found', 404);
        }
      }

      // Check if menu name already exists (excluding current menu)
      if (menu_name && menu_name !== menu.menu_name) {
        const existingMenu = await this.menusRepository.findOne({
          menu_name,
          is_delete: false,
          menu_id: { $ne: id }
        });

        if (existingMenu) {
          throw new CustomException('Menu name already exists', 400);
        }
      }

      const updateData = {
        updated_at: new Date(),
        updated_by: updatedBy,
      };

      if (menu_name) updateData.menu_name = menu_name;
      if (menu_parent_id !== undefined) updateData.menu_parent_id = menu_parent_id;
      if (menu_url !== undefined) updateData.menu_url = menu_url;
      if (menu_icon !== undefined) updateData.menu_icon = menu_icon;
      if (menu_order !== undefined) updateData.menu_order = menu_order;

      const updatedMenu = await this.menusRepository.updateMenu(id, updateData);

      logger.info('Menu updated successfully', { menu_id: id });

      return res.status(200).json({
        success: true,
        message: 'Menu updated successfully',
        data: updatedMenu,
      });
    } catch (error) {
      logger.error('Error updating menu:', error);
      throw error;
    }
  }

  async deleteMenu(req, res) {
    try {
      const { id } = req.params;
      const deletedBy = req.user?.user_id;

      const menu = await this.menusRepository.findById(id);

      if (!menu) {
        throw new CustomException('Menu not found', 404);
      }

      // Check if menu has children
      const children = await this.menusRepository.findChildren(id);
      if (children.length > 0) {
        throw new CustomException('Cannot delete menu with children. Please delete children first.', 400);
      }

      await this.menusRepository.deleteMenu(id, deletedBy);

      logger.info('Menu deleted successfully', { menu_id: id });

      return res.status(200).json({
        success: true,
        message: 'Menu deleted successfully',
      });
    } catch (error) {
      logger.error('Error deleting menu:', error);
      throw error;
    }
  }

  async restoreMenu(req, res) {
    try {
      const { id } = req.params;
      const updatedBy = req.user?.user_id;

      const menu = await this.menusRepository.findOne({
        menu_id: id,
        is_delete: true
      });

      if (!menu) {
        throw new CustomException('Menu not found or not deleted', 404);
      }

      await this.menusRepository.restoreMenu(id, updatedBy);

      logger.info('Menu restored successfully', { menu_id: id });

      return res.status(200).json({
        success: true,
        message: 'Menu restored successfully',
      });
    } catch (error) {
      logger.error('Error restoring menu:', error);
      throw error;
    }
  }
}

module.exports = MenusHandler;
