const SystemsRepository = require('./postgre_repository');
const { CustomException } = require('../../utils/exception');
const { logger } = require('../../utils/logger');

class SystemsHandler {
  constructor() {
    this.systemsRepository = new SystemsRepository();
  }

  async createSystem(req, res) {
    try {
      const { system_name, system_url, system_icon, system_order } = req.body;
      const createdBy = req.user?.user_id;

      // Check if system name already exists
      const existingSystem = await this.systemsRepository.findOne({
        system_name,
        is_delete: false
      });

      if (existingSystem) {
        throw new CustomException('System name already exists', 400);
      }

      const systemData = {
        system_name,
        system_url: system_url || null,
        system_icon: system_icon || 'far fa-circle nav-icon',
        system_order: system_order || 0,
        created_by: createdBy,
      };

      const system = await this.systemsRepository.createSystem(systemData);

      logger.info('System created successfully', { system_id: system.system_id });

      return res.status(201).json({
        success: true,
        message: 'System created successfully',
        data: system,
      });
    } catch (error) {
      logger.error('Error creating system:', error);
      throw error;
    }
  }

  async getSystem(req, res) {
    try {
      const { id } = req.params;

      const system = await this.systemsRepository.findById(id);

      if (!system) {
        throw new CustomException('System not found', 404);
      }

      return res.status(200).json({
        success: true,
        message: 'System retrieved successfully',
        data: system,
      });
    } catch (error) {
      logger.error('Error getting system:', error);
      throw error;
    }
  }

  async listSystems(req, res) {
    try {
      const { page = 1, limit = 10, search } = req.query;
      const offset = (page - 1) * limit;

      let whereCondition = { is_delete: false };

      if (search) {
        whereCondition.system_name = {
          $ilike: `%${search}%`
        };
      }

      const systems = await this.systemsRepository.findMany(whereCondition, {
        limit: parseInt(limit),
        offset: parseInt(offset),
        orderBy: 'system_order',
        orderDirection: 'asc'
      });

      const total = await this.systemsRepository.count(whereCondition);

      return res.status(200).json({
        success: true,
        message: 'Systems retrieved successfully',
        data: {
          systems,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      logger.error('Error listing systems:', error);
      throw error;
    }
  }

  async updateSystem(req, res) {
    try {
      const { id } = req.params;
      const { system_name, system_url, system_icon, system_order } = req.body;
      const updatedBy = req.user?.user_id;

      const system = await this.systemsRepository.findById(id);

      if (!system) {
        throw new CustomException('System not found', 404);
      }

      // Check if system name already exists (excluding current system)
      if (system_name && system_name !== system.system_name) {
        const existingSystem = await this.systemsRepository.findOne({
          system_name,
          is_delete: false,
          system_id: { $ne: id }
        });

        if (existingSystem) {
          throw new CustomException('System name already exists', 400);
        }
      }

      const updateData = {
        updated_at: new Date(),
        updated_by: updatedBy,
      };

      if (system_name) updateData.system_name = system_name;
      if (system_url !== undefined) updateData.system_url = system_url;
      if (system_icon !== undefined) updateData.system_icon = system_icon;
      if (system_order !== undefined) updateData.system_order = system_order;

      const updatedSystem = await this.systemsRepository.updateSystem(id, updateData);

      logger.info('System updated successfully', { system_id: id });

      return res.status(200).json({
        success: true,
        message: 'System updated successfully',
        data: updatedSystem,
      });
    } catch (error) {
      logger.error('Error updating system:', error);
      throw error;
    }
  }

  async deleteSystem(req, res) {
    try {
      const { id } = req.params;
      const deletedBy = req.user?.user_id;

      const system = await this.systemsRepository.findById(id);

      if (!system) {
        throw new CustomException('System not found', 404);
      }

      await this.systemsRepository.deleteSystem(id, deletedBy);

      logger.info('System deleted successfully', { system_id: id });

      return res.status(200).json({
        success: true,
        message: 'System deleted successfully',
      });
    } catch (error) {
      logger.error('Error deleting system:', error);
      throw error;
    }
  }

  async restoreSystem(req, res) {
    try {
      const { id } = req.params;
      const updatedBy = req.user?.user_id;

      const system = await this.systemsRepository.findOne({
        system_id: id,
        is_delete: true
      });

      if (!system) {
        throw new CustomException('System not found or not deleted', 404);
      }

      await this.systemsRepository.restoreSystem(id, updatedBy);

      logger.info('System restored successfully', { system_id: id });

      return res.status(200).json({
        success: true,
        message: 'System restored successfully',
      });
    } catch (error) {
      logger.error('Error restoring system:', error);
      throw error;
    }
  }
}

module.exports = SystemsHandler;
