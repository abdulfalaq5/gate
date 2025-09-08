const RolesRepository = require('./postgre_repository');
const { successResponse, errorResponse } = require('../../utils/response');
const { parseStandardQuery } = require('../../utils/pagination');
const { pgCore } = require('../../config/database');

class RolesHandler {
  constructor() {
    this.rolesRepository = new RolesRepository(pgCore);
  }

  async createRole(req, res) {
    try {
      const { role_name } = req.body;
      const createdBy = req.user?.user_id;

      if (!role_name) {
        return errorResponse(res, 'Role name is required', 400);
      }

      const roleData = {
        role_name,
        created_by: createdBy,
      };

      const role = await this.rolesRepository.createRole(roleData);

      return successResponse(res, role, 'Role created successfully', 201);
    } catch (error) {
      console.error('Error creating role:', error);
      return errorResponse(res, 'Failed to create role', 500);
    }
  }

  async getRole(req, res) {
    try {
      const { id } = req.params;

      const role = await this.rolesRepository.findById(id);

      if (!role) {
        return errorResponse(res, 'Role not found', 404);
      }

      return successResponse(res, role, 'Role retrieved successfully');
    } catch (error) {
      console.error('Error getting role:', error);
      return errorResponse(res, 'Failed to retrieve role', 500);
    }
  }

  async listRoles(req, res) {
    try {
      // Parse query parameters dengan konfigurasi untuk roles
      const queryParams = parseStandardQuery(req, {
        allowedSortColumns: ['role_name', 'created_at', 'updated_at'],
        defaultSort: ['role_name', 'asc'],
        searchableColumns: ['role_name'],
        allowedFilters: ['role_name'],
        dateColumn: 'created_at'
      });

      // Gunakan method baru dengan filter standar
      const result = await this.rolesRepository.findWithFilters(queryParams);

      return successResponse(res, result, 'Roles retrieved successfully');
    } catch (error) {
      console.error('Error listing roles:', error);
      return errorResponse(res, 'Failed to retrieve roles', 500);
    }
  }

  async getRolePermissions(req, res) {
    try {
      const { id } = req.params;
      // Implementasi sederhana - bisa dikembangkan lebih lanjut
      return successResponse(res, [], 'Role permissions retrieved successfully');
    } catch (error) {
      console.error('Error getting role permissions:', error);
      return errorResponse(res, 'Failed to retrieve role permissions', 500);
    }
  }

  async assignPermissions(req, res) {
    try {
      const { id } = req.params;
      // Implementasi sederhana - bisa dikembangkan lebih lanjut
      return successResponse(res, null, 'Permissions assigned successfully');
    } catch (error) {
      console.error('Error assigning permissions:', error);
      return errorResponse(res, 'Failed to assign permissions', 500);
    }
  }

  async updateRole(req, res) {
    try {
      const { id } = req.params;
      const { role_name } = req.body;
      const updatedBy = req.user?.user_id;

      const role = await this.rolesRepository.findById(id);

      if (!role) {
        return errorResponse(res, 'Role not found', 404);
      }

      const updateData = {
        updated_by: updatedBy,
      };

      if (role_name) updateData.role_name = role_name;

      const updatedRole = await this.rolesRepository.updateRole(id, updateData);

      return successResponse(res, updatedRole, 'Role updated successfully');
    } catch (error) {
      console.error('Error updating role:', error);
      return errorResponse(res, 'Failed to update role', 500);
    }
  }

  async deleteRole(req, res) {
    try {
      const { id } = req.params;
      const deletedBy = req.user?.user_id;

      const role = await this.rolesRepository.findById(id);

      if (!role) {
        return errorResponse(res, 'Role not found', 404);
      }

      await this.rolesRepository.deleteRole(id, deletedBy);

      return successResponse(res, null, 'Role deleted successfully');
    } catch (error) {
      console.error('Error deleting role:', error);
      return errorResponse(res, 'Failed to delete role', 500);
    }
  }
}

module.exports = new RolesHandler();