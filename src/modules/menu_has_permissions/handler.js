const MenuHasPermissionsRepository = require('./postgre_repository');
const { successResponse, errorResponse } = require('../../utils/response');
const { parseStandardQuery } = require('../../utils/pagination');
const { pgCore } = require('../../config/database');

class MenuHasPermissionsHandler {
  constructor() {
    this.menuHasPermissionsRepository = new MenuHasPermissionsRepository(pgCore);
  }

  async createMenuHasPermission(req, res) {
    try {
      const { menu_id, permission_id } = req.body;
      const createdBy = req.user?.user_id;

      if (!menu_id || !permission_id) {
        return errorResponse(res, 'Menu ID and Permission ID are required', 400);
      }

      // Check if relationship already exists
      const existingRecord = await this.menuHasPermissionsRepository.findById(menu_id, permission_id);
      if (existingRecord) {
        return errorResponse(res, 'Menu-Permission relationship already exists', 409);
      }

      const recordData = {
        menu_id,
        permission_id,
        created_by: createdBy,
      };

      const record = await this.menuHasPermissionsRepository.createMenuHasPermission(recordData);

      return successResponse(res, record, 'Menu-Permission relationship created successfully', 201);
    } catch (error) {
      console.error('Error creating menu-permission relationship:', error);
      return errorResponse(res, 'Failed to create menu-permission relationship', 500);
    }
  }

  async getMenuHasPermission(req, res) {
    try {
      const { menu_id, permission_id } = req.params;

      const record = await this.menuHasPermissionsRepository.findById(menu_id, permission_id);

      if (!record) {
        return errorResponse(res, 'Menu-Permission relationship not found', 404);
      }

      return successResponse(res, record, 'Menu-Permission relationship retrieved successfully');
    } catch (error) {
      console.error('Error getting menu-permission relationship:', error);
      return errorResponse(res, 'Failed to retrieve menu-permission relationship', 500);
    }
  }

  async listMenuHasPermissions(req, res) {
    try {
      // Parse query parameters dengan konfigurasi untuk menuHasPermissions
      const queryParams = parseStandardQuery(req, {
        allowedSortColumns: ['menu_name', 'permission_name', 'created_at', 'updated_at'],
        defaultSort: ['created_at', 'desc'],
        searchableColumns: ['menu_name', 'permission_name'],
        allowedFilters: ['menu_id', 'permission_id'],
        dateColumn: 'created_at'
      });

      // Gunakan method dengan filter standar
      const result = await this.menuHasPermissionsRepository.findWithFilters(queryParams);

      return successResponse(res, result, 'Menu-Permission relationships retrieved successfully');
    } catch (error) {
      console.error('Error listing menu-permission relationships:', error);
      return errorResponse(res, 'Failed to retrieve menu-permission relationships', 500);
    }
  }

  async getPermissionsByMenu(req, res) {
    try {
      const { menu_id } = req.params;

      const permissions = await this.menuHasPermissionsRepository.findByMenuId(menu_id);

      return successResponse(res, permissions, 'Permissions for menu retrieved successfully');
    } catch (error) {
      console.error('Error getting permissions by menu:', error);
      return errorResponse(res, 'Failed to retrieve permissions for menu', 500);
    }
  }

  async getMenusByPermission(req, res) {
    try {
      const { permission_id } = req.params;

      const menus = await this.menuHasPermissionsRepository.findByPermissionId(permission_id);

      return successResponse(res, menus, 'Menus for permission retrieved successfully');
    } catch (error) {
      console.error('Error getting menus by permission:', error);
      return errorResponse(res, 'Failed to retrieve menus for permission', 500);
    }
  }

  async updateMenuHasPermission(req, res) {
    try {
      const { menu_id, permission_id } = req.params;
      const updatedBy = req.user?.user_id;

      const record = await this.menuHasPermissionsRepository.findById(menu_id, permission_id);

      if (!record) {
        return errorResponse(res, 'Menu-Permission relationship not found', 404);
      }

      const updateData = {
        updated_by: updatedBy,
      };

      const updatedRecord = await this.menuHasPermissionsRepository.updateMenuHasPermission(menu_id, permission_id, updateData);

      return successResponse(res, updatedRecord, 'Menu-Permission relationship updated successfully');
    } catch (error) {
      console.error('Error updating menu-permission relationship:', error);
      return errorResponse(res, 'Failed to update menu-permission relationship', 500);
    }
  }

  async deleteMenuHasPermission(req, res) {
    try {
      const { menu_id, permission_id } = req.params;

      const record = await this.menuHasPermissionsRepository.findById(menu_id, permission_id);

      if (!record) {
        return errorResponse(res, 'Menu-Permission relationship not found', 404);
      }

      await this.menuHasPermissionsRepository.deleteMenuHasPermission(menu_id, permission_id);

      return successResponse(res, null, 'Menu-Permission relationship deleted successfully');
    } catch (error) {
      console.error('Error deleting menu-permission relationship:', error);
      return errorResponse(res, 'Failed to delete menu-permission relationship', 500);
    }
  }

  async deleteByMenu(req, res) {
    try {
      const { menu_id } = req.params;

      const deletedRecords = await this.menuHasPermissionsRepository.deleteByMenuId(menu_id);

      return successResponse(res, { deleted_count: deletedRecords.length }, 'All menu-permission relationships for menu deleted successfully');
    } catch (error) {
      console.error('Error deleting menu-permission relationships by menu:', error);
      return errorResponse(res, 'Failed to delete menu-permission relationships', 500);
    }
  }

  async deleteByPermission(req, res) {
    try {
      const { permission_id } = req.params;

      const deletedRecords = await this.menuHasPermissionsRepository.deleteByPermissionId(permission_id);

      return successResponse(res, { deleted_count: deletedRecords.length }, 'All menu-permission relationships for permission deleted successfully');
    } catch (error) {
      console.error('Error deleting menu-permission relationships by permission:', error);
      return errorResponse(res, 'Failed to delete menu-permission relationships', 500);
    }
  }
}

module.exports = new MenuHasPermissionsHandler();
