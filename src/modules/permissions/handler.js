const PermissionsRepository = require('./postgre_repository');
const { successResponse, errorResponse } = require('../../utils/response');
const { parseStandardQuery } = require('../../utils/pagination');
const { pgCore } = require('../../config/database');

class PermissionsHandler {
  constructor() {
    this.permissionsRepository = new PermissionsRepository(pgCore);
  }

  async createPermission(req, res) {
    try {
      const { permission_name } = req.body;
      const createdBy = req.user?.user_id;

      if (!permission_name) {
        return errorResponse(res, 'Permission name is required', 400);
      }

      const permissionData = {
        permission_name,
        created_by: createdBy,
      };

      const permission = await this.permissionsRepository.createPermission(permissionData);

      return successResponse(res, permission, 'Permission created successfully', 201);
    } catch (error) {
      console.error('Error creating permission:', error);
      return errorResponse(res, 'Failed to create permission', 500);
    }
  }

  async getPermission(req, res) {
    try {
      const { id } = req.params;

      const permission = await this.permissionsRepository.findById(id);

      if (!permission) {
        return errorResponse(res, 'Permission not found', 404);
      }

      return successResponse(res, permission, 'Permission retrieved successfully');
    } catch (error) {
      console.error('Error getting permission:', error);
      return errorResponse(res, 'Failed to retrieve permission', 500);
    }
  }

  async listPermissions(req, res) {
    try {
      // Parse query parameters dengan konfigurasi untuk permissions
      const queryParams = parseStandardQuery(req, {
        allowedSortColumns: ['permission_name', 'created_at', 'updated_at'],
        defaultSort: ['permission_name', 'asc'],
        searchableColumns: ['permission_name'],
        allowedFilters: ['permission_name'],
        dateColumn: 'created_at'
      });

      // Gunakan method baru dengan filter standar
      const result = await this.permissionsRepository.findWithFilters(queryParams);

      return successResponse(res, result, 'Permissions retrieved successfully');
    } catch (error) {
      console.error('Error listing permissions:', error);
      return errorResponse(res, 'Failed to retrieve permissions', 500);
    }
  }

  async updatePermission(req, res) {
    try {
      const { id } = req.params;
      const { permission_name } = req.body;
      const updatedBy = req.user?.user_id;

      const permission = await this.permissionsRepository.findById(id);

      if (!permission) {
        return errorResponse(res, 'Permission not found', 404);
      }

      const updateData = {
        updated_by: updatedBy,
      };

      if (permission_name) {
        updateData.permission_name = permission_name;
      }

      const updatedPermission = await this.permissionsRepository.updatePermission(id, updateData);

      return successResponse(res, updatedPermission, 'Permission updated successfully');
    } catch (error) {
      console.error('Error updating permission:', error);
      return errorResponse(res, 'Failed to update permission', 500);
    }
  }

  async deletePermission(req, res) {
    try {
      const { id } = req.params;
      const deletedBy = req.user?.user_id;

      const permission = await this.permissionsRepository.findById(id);

      if (!permission) {
        return errorResponse(res, 'Permission not found', 404);
      }

      await this.permissionsRepository.deletePermission(id, deletedBy);

      return successResponse(res, null, 'Permission deleted successfully');
    } catch (error) {
      console.error('Error deleting permission:', error);
      return errorResponse(res, 'Failed to delete permission', 500);
    }
  }

  async restorePermission(req, res) {
    try {
      const { id } = req.params;
      const updatedBy = req.user?.user_id;

      await this.permissionsRepository.restorePermission(id, updatedBy);

      return successResponse(res, null, 'Permission restored successfully');
    } catch (error) {
      console.error('Error restoring permission:', error);
      return errorResponse(res, 'Failed to restore permission', 500);
    }
  }
}

module.exports = new PermissionsHandler();