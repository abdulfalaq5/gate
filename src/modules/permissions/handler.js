const PermissionsRepository = require('./postgre_repository');
const { CustomException } = require('../../utils/exception');
const { logger } = require('../../utils/logger');

class PermissionsHandler {
  constructor() {
    this.permissionsRepository = new PermissionsRepository();
  }

  async createPermission(req, res) {
    try {
      const { permission_name } = req.body;
      const createdBy = req.user?.user_id;

      // Check if permission already exists
      const existingPermission = await this.permissionsRepository.findOne({
        permission_name,
        is_delete: false
      });

      if (existingPermission) {
        throw new CustomException('Permission already exists', 400);
      }

      const permissionData = {
        permission_name,
        created_by: createdBy,
      };

      const permission = await this.permissionsRepository.createPermission(permissionData);

      logger.info('Permission created successfully', { permission_id: permission.permission_id });

      return res.status(201).json({
        success: true,
        message: 'Permission created successfully',
        data: permission,
      });
    } catch (error) {
      logger.error('Error creating permission:', error);
      throw error;
    }
  }

  async getPermission(req, res) {
    try {
      const { id } = req.params;

      const permission = await this.permissionsRepository.findById(id);

      if (!permission) {
        throw new CustomException('Permission not found', 404);
      }

      return res.status(200).json({
        success: true,
        message: 'Permission retrieved successfully',
        data: permission,
      });
    } catch (error) {
      logger.error('Error getting permission:', error);
      throw error;
    }
  }

  async listPermissions(req, res) {
    try {
      const { page = 1, limit = 10, search } = req.query;
      const offset = (page - 1) * limit;

      let whereCondition = { is_delete: false };

      if (search) {
        whereCondition.permission_name = {
          $ilike: `%${search}%`
        };
      }

      const permissions = await this.permissionsRepository.findMany(whereCondition, {
        limit: parseInt(limit),
        offset: parseInt(offset),
        orderBy: 'created_at',
        orderDirection: 'desc'
      });

      const total = await this.permissionsRepository.count(whereCondition);

      return res.status(200).json({
        success: true,
        message: 'Permissions retrieved successfully',
        data: {
          permissions,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      logger.error('Error listing permissions:', error);
      throw error;
    }
  }

  async updatePermission(req, res) {
    try {
      const { id } = req.params;
      const { permission_name } = req.body;
      const updatedBy = req.user?.user_id;

      const permission = await this.permissionsRepository.findById(id);

      if (!permission) {
        throw new CustomException('Permission not found', 404);
      }

      // Check if permission name already exists (excluding current permission)
      if (permission_name && permission_name !== permission.permission_name) {
        const existingPermission = await this.permissionsRepository.findOne({
          permission_name,
          is_delete: false,
          permission_id: { $ne: id }
        });

        if (existingPermission) {
          throw new CustomException('Permission name already exists', 400);
        }
      }

      const updateData = {
        updated_at: new Date(),
        updated_by: updatedBy,
      };

      if (permission_name) {
        updateData.permission_name = permission_name;
      }

      const updatedPermission = await this.permissionsRepository.updatePermission(id, updateData);

      logger.info('Permission updated successfully', { permission_id: id });

      return res.status(200).json({
        success: true,
        message: 'Permission updated successfully',
        data: updatedPermission,
      });
    } catch (error) {
      logger.error('Error updating permission:', error);
      throw error;
    }
  }

  async deletePermission(req, res) {
    try {
      const { id } = req.params;
      const deletedBy = req.user?.user_id;

      const permission = await this.permissionsRepository.findById(id);

      if (!permission) {
        throw new CustomException('Permission not found', 404);
      }

      await this.permissionsRepository.deletePermission(id, deletedBy);

      logger.info('Permission deleted successfully', { permission_id: id });

      return res.status(200).json({
        success: true,
        message: 'Permission deleted successfully',
      });
    } catch (error) {
      logger.error('Error deleting permission:', error);
      throw error;
    }
  }

  async restorePermission(req, res) {
    try {
      const { id } = req.params;
      const updatedBy = req.user?.user_id;

      const permission = await this.permissionsRepository.findOne({
        permission_id: id,
        is_delete: true
      });

      if (!permission) {
        throw new CustomException('Permission not found or not deleted', 404);
      }

      await this.permissionsRepository.restorePermission(id, updatedBy);

      logger.info('Permission restored successfully', { permission_id: id });

      return res.status(200).json({
        success: true,
        message: 'Permission restored successfully',
      });
    } catch (error) {
      logger.error('Error restoring permission:', error);
      throw error;
    }
  }
}

module.exports = PermissionsHandler;
