const RolesRepository = require('./postgre_repository');
const { CustomException } = require('../../utils/exception');
const { logger } = require('../../utils/logger');

class RolesHandler {
  constructor() {
    this.rolesRepository = new RolesRepository();
  }

  async createRole(req, res) {
    try {
      const { role_name, role_parent_id } = req.body;
      const createdBy = req.user?.user_id;

      // Check if parent role exists (if provided)
      if (role_parent_id) {
        const parentRole = await this.rolesRepository.findById(role_parent_id);
        if (!parentRole) {
          throw new CustomException('Parent role not found', 404);
        }
      }

      // Check if role name already exists
      const existingRole = await this.rolesRepository.findOne({
        role_name,
        is_delete: false
      });

      if (existingRole) {
        throw new CustomException('Role name already exists', 400);
      }

      const roleData = {
        role_name,
        role_parent_id: role_parent_id || null,
        created_by: createdBy,
      };

      const role = await this.rolesRepository.createRole(roleData);

      logger.info('Role created successfully', { role_id: role.role_id });

      return res.status(201).json({
        success: true,
        message: 'Role created successfully',
        data: role,
      });
    } catch (error) {
      logger.error('Error creating role:', error);
      throw error;
    }
  }

  async getRole(req, res) {
    try {
      const { id } = req.params;

      const role = await this.rolesRepository.findById(id);

      if (!role) {
        throw new CustomException('Role not found', 404);
      }

      return res.status(200).json({
        success: true,
        message: 'Role retrieved successfully',
        data: role,
      });
    } catch (error) {
      logger.error('Error getting role:', error);
      throw error;
    }
  }

  async listRoles(req, res) {
    try {
      const { page = 1, limit = 10, search } = req.query;
      const offset = (page - 1) * limit;

      let whereCondition = { is_delete: false };

      if (search) {
        whereCondition.role_name = {
          $ilike: `%${search}%`
        };
      }

      const roles = await this.rolesRepository.findMany(whereCondition, {
        limit: parseInt(limit),
        offset: parseInt(offset),
        orderBy: 'created_at',
        orderDirection: 'desc'
      });

      const total = await this.rolesRepository.count(whereCondition);

      return res.status(200).json({
        success: true,
        message: 'Roles retrieved successfully',
        data: {
          roles,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      logger.error('Error listing roles:', error);
      throw error;
    }
  }

  async getRolePermissions(req, res) {
    try {
      const { id } = req.params;

      const role = await this.rolesRepository.findById(id);

      if (!role) {
        throw new CustomException('Role not found', 404);
      }

      const permissions = await this.rolesRepository.getRolePermissions(id);

      return res.status(200).json({
        success: true,
        message: 'Role permissions retrieved successfully',
        data: permissions.rows || permissions,
      });
    } catch (error) {
      logger.error('Error getting role permissions:', error);
      throw error;
    }
  }

  async assignPermissions(req, res) {
    try {
      const { id } = req.params;
      const { permissions } = req.body;
      const createdBy = req.user?.user_id;

      const role = await this.rolesRepository.findById(id);

      if (!role) {
        throw new CustomException('Role not found', 404);
      }

      // Add created_by to each permission
      const permissionsWithCreator = permissions.map(perm => ({
        ...perm,
        created_by: createdBy
      }));

      await this.rolesRepository.assignPermissions(id, permissionsWithCreator);

      logger.info('Role permissions assigned successfully', { role_id: id });

      return res.status(200).json({
        success: true,
        message: 'Role permissions assigned successfully',
      });
    } catch (error) {
      logger.error('Error assigning role permissions:', error);
      throw error;
    }
  }

  async updateRole(req, res) {
    try {
      const { id } = req.params;
      const { role_name, role_parent_id } = req.body;
      const updatedBy = req.user?.user_id;

      const role = await this.rolesRepository.findById(id);

      if (!role) {
        throw new CustomException('Role not found', 404);
      }

      // Check if parent role exists (if provided)
      if (role_parent_id) {
        const parentRole = await this.rolesRepository.findById(role_parent_id);
        if (!parentRole) {
          throw new CustomException('Parent role not found', 404);
        }
      }

      // Check if role name already exists (excluding current role)
      if (role_name && role_name !== role.role_name) {
        const existingRole = await this.rolesRepository.findOne({
          role_name,
          is_delete: false,
          role_id: { $ne: id }
        });

        if (existingRole) {
          throw new CustomException('Role name already exists', 400);
        }
      }

      const updateData = {
        updated_at: new Date(),
        updated_by: updatedBy,
      };

      if (role_name) updateData.role_name = role_name;
      if (role_parent_id !== undefined) updateData.role_parent_id = role_parent_id;

      const updatedRole = await this.rolesRepository.updateRole(id, updateData);

      logger.info('Role updated successfully', { role_id: id });

      return res.status(200).json({
        success: true,
        message: 'Role updated successfully',
        data: updatedRole,
      });
    } catch (error) {
      logger.error('Error updating role:', error);
      throw error;
    }
  }

  async deleteRole(req, res) {
    try {
      const { id } = req.params;
      const deletedBy = req.user?.user_id;

      const role = await this.rolesRepository.findById(id);

      if (!role) {
        throw new CustomException('Role not found', 404);
      }

      // Check if role has children
      const children = await this.rolesRepository.findChildren(id);
      if (children.length > 0) {
        throw new CustomException('Cannot delete role with children. Please delete children first.', 400);
      }

      await this.rolesRepository.deleteRole(id, deletedBy);

      logger.info('Role deleted successfully', { role_id: id });

      return res.status(200).json({
        success: true,
        message: 'Role deleted successfully',
      });
    } catch (error) {
      logger.error('Error deleting role:', error);
      throw error;
    }
  }

  async restoreRole(req, res) {
    try {
      const { id } = req.params;
      const updatedBy = req.user?.user_id;

      const role = await this.rolesRepository.findOne({
        role_id: id,
        is_delete: true
      });

      if (!role) {
        throw new CustomException('Role not found or not deleted', 404);
      }

      await this.rolesRepository.restoreRole(id, updatedBy);

      logger.info('Role restored successfully', { role_id: id });

      return res.status(200).json({
        success: true,
        message: 'Role restored successfully',
      });
    } catch (error) {
      logger.error('Error restoring role:', error);
      throw error;
    }
  }
}

module.exports = RolesHandler;
