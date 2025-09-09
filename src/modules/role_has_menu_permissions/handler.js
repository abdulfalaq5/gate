const RoleHasMenuPermissionsRepository = require('./postgre_repository');
const { successResponse, errorResponse } = require('../../utils/response');
const { parseStandardQuery } = require('../../utils/pagination');
const { pgCore } = require('../../config/database');

class RoleHasMenuPermissionsHandler {
  constructor() {
    this.roleHasMenuPermissionsRepository = new RoleHasMenuPermissionsRepository(pgCore);
  }

  async createRoleHasMenuPermission(req, res) {
    try {
      const { role_id, menu_id, permission_id } = req.body;
      const createdBy = req.user?.user_id;

      if (!role_id || !menu_id || !permission_id) {
        return errorResponse(res, 'Role ID, Menu ID, and Permission ID are required', 400);
      }

      // Check if relationship already exists
      const existingRecord = await this.roleHasMenuPermissionsRepository.findById(role_id, menu_id, permission_id);
      if (existingRecord) {
        return errorResponse(res, 'Role-Menu-Permission relationship already exists', 409);
      }

      const recordData = {
        role_id,
        menu_id,
        permission_id,
        created_by: createdBy,
      };

      const record = await this.roleHasMenuPermissionsRepository.createRoleHasMenuPermission(recordData);

      return successResponse(res, record, 'Role-Menu-Permission relationship created successfully', 201);
    } catch (error) {
      console.error('Error creating role-menu-permission relationship:', error);
      return errorResponse(res, 'Failed to create role-menu-permission relationship', 500);
    }
  }

  async getRoleHasMenuPermission(req, res) {
    try {
      const { role_id, menu_id, permission_id } = req.params;

      const record = await this.roleHasMenuPermissionsRepository.findById(role_id, menu_id, permission_id);

      if (!record) {
        return errorResponse(res, 'Role-Menu-Permission relationship not found', 404);
      }

      return successResponse(res, record, 'Role-Menu-Permission relationship retrieved successfully');
    } catch (error) {
      console.error('Error getting role-menu-permission relationship:', error);
      return errorResponse(res, 'Failed to retrieve role-menu-permission relationship', 500);
    }
  }

  async listRoleHasMenuPermissions(req, res) {
    try {
      // Parse query parameters dengan konfigurasi untuk roleHasMenuPermissions
      const queryParams = parseStandardQuery(req, {
        allowedSortColumns: ['role_name', 'menu_name', 'permission_name', 'created_at', 'updated_at'],
        defaultSort: ['created_at', 'desc'],
        searchableColumns: ['role_name', 'menu_name', 'permission_name'],
        allowedFilters: ['role_id', 'menu_id', 'permission_id'],
        dateColumn: 'created_at'
      });

      // Gunakan method dengan filter standar
      const result = await this.roleHasMenuPermissionsRepository.findWithFilters(queryParams);

      return successResponse(res, result, 'Role-Menu-Permission relationships retrieved successfully');
    } catch (error) {
      console.error('Error listing role-menu-permission relationships:', error);
      return errorResponse(res, 'Failed to retrieve role-menu-permission relationships', 500);
    }
  }

  async getPermissionsByRole(req, res) {
    try {
      const { role_id } = req.params;

      const permissions = await this.roleHasMenuPermissionsRepository.findByRoleId(role_id);

      return successResponse(res, permissions, 'Permissions for role retrieved successfully');
    } catch (error) {
      console.error('Error getting permissions by role:', error);
      return errorResponse(res, 'Failed to retrieve permissions for role', 500);
    }
  }

  async getRolesByMenu(req, res) {
    try {
      const { menu_id } = req.params;

      const roles = await this.roleHasMenuPermissionsRepository.findByMenuId(menu_id);

      return successResponse(res, roles, 'Roles for menu retrieved successfully');
    } catch (error) {
      console.error('Error getting roles by menu:', error);
      return errorResponse(res, 'Failed to retrieve roles for menu', 500);
    }
  }

  async getRolesByPermission(req, res) {
    try {
      const { permission_id } = req.params;

      const roles = await this.roleHasMenuPermissionsRepository.findByPermissionId(permission_id);

      return successResponse(res, roles, 'Roles for permission retrieved successfully');
    } catch (error) {
      console.error('Error getting roles by permission:', error);
      return errorResponse(res, 'Failed to retrieve roles for permission', 500);
    }
  }

  async getPermissionsByRoleAndMenu(req, res) {
    try {
      const { role_id, menu_id } = req.params;

      const permissions = await this.roleHasMenuPermissionsRepository.findByRoleAndMenu(role_id, menu_id);

      return successResponse(res, permissions, 'Permissions for role and menu retrieved successfully');
    } catch (error) {
      console.error('Error getting permissions by role and menu:', error);
      return errorResponse(res, 'Failed to retrieve permissions for role and menu', 500);
    }
  }

  async updateRoleHasMenuPermission(req, res) {
    try {
      const { role_id, menu_id, permission_id } = req.params;
      const updatedBy = req.user?.user_id;

      const record = await this.roleHasMenuPermissionsRepository.findById(role_id, menu_id, permission_id);

      if (!record) {
        return errorResponse(res, 'Role-Menu-Permission relationship not found', 404);
      }

      const updateData = {
        updated_by: updatedBy,
      };

      const updatedRecord = await this.roleHasMenuPermissionsRepository.updateRoleHasMenuPermission(role_id, menu_id, permission_id, updateData);

      return successResponse(res, updatedRecord, 'Role-Menu-Permission relationship updated successfully');
    } catch (error) {
      console.error('Error updating role-menu-permission relationship:', error);
      return errorResponse(res, 'Failed to update role-menu-permission relationship', 500);
    }
  }

  async deleteRoleHasMenuPermission(req, res) {
    try {
      const { role_id, menu_id, permission_id } = req.params;

      const record = await this.roleHasMenuPermissionsRepository.findById(role_id, menu_id, permission_id);

      if (!record) {
        return errorResponse(res, 'Role-Menu-Permission relationship not found', 404);
      }

      await this.roleHasMenuPermissionsRepository.deleteRoleHasMenuPermission(role_id, menu_id, permission_id);

      return successResponse(res, null, 'Role-Menu-Permission relationship deleted successfully');
    } catch (error) {
      console.error('Error deleting role-menu-permission relationship:', error);
      return errorResponse(res, 'Failed to delete role-menu-permission relationship', 500);
    }
  }

  async deleteByRole(req, res) {
    try {
      const { role_id } = req.params;

      const deletedRecords = await this.roleHasMenuPermissionsRepository.deleteByRoleId(role_id);

      return successResponse(res, { deleted_count: deletedRecords.length }, 'All role-menu-permission relationships for role deleted successfully');
    } catch (error) {
      console.error('Error deleting role-menu-permission relationships by role:', error);
      return errorResponse(res, 'Failed to delete role-menu-permission relationships', 500);
    }
  }

  async deleteByMenu(req, res) {
    try {
      const { menu_id } = req.params;

      const deletedRecords = await this.roleHasMenuPermissionsRepository.deleteByMenuId(menu_id);

      return successResponse(res, { deleted_count: deletedRecords.length }, 'All role-menu-permission relationships for menu deleted successfully');
    } catch (error) {
      console.error('Error deleting role-menu-permission relationships by menu:', error);
      return errorResponse(res, 'Failed to delete role-menu-permission relationships', 500);
    }
  }

  async deleteByPermission(req, res) {
    try {
      const { permission_id } = req.params;

      const deletedRecords = await this.roleHasMenuPermissionsRepository.deleteByPermissionId(permission_id);

      return successResponse(res, { deleted_count: deletedRecords.length }, 'All role-menu-permission relationships for permission deleted successfully');
    } catch (error) {
      console.error('Error deleting role-menu-permission relationships by permission:', error);
      return errorResponse(res, 'Failed to delete role-menu-permission relationships', 500);
    }
  }

  async deleteByRoleAndMenu(req, res) {
    try {
      const { role_id, menu_id } = req.params;

      const deletedRecords = await this.roleHasMenuPermissionsRepository.deleteByRoleAndMenu(role_id, menu_id);

      return successResponse(res, { deleted_count: deletedRecords.length }, 'All role-menu-permission relationships for role and menu deleted successfully');
    } catch (error) {
      console.error('Error deleting role-menu-permission relationships by role and menu:', error);
      return errorResponse(res, 'Failed to delete role-menu-permission relationships', 500);
    }
  }
}

module.exports = new RoleHasMenuPermissionsHandler();
