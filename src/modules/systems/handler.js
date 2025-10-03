const SystemsRepository = require('./postgre_repository');
const { successResponse, errorResponse } = require('../../utils/response');
const { pgCore } = require('../../config/database');

class SystemsHandler {
  constructor() {
    this.systemsRepository = new SystemsRepository(pgCore);
  }

  async createSystem(req, res) {
    try {
      const { system_name, system_url, system_icon, system_order } = req.body;
      const createdBy = req.user?.user_id;

      if (!system_name) {
        return errorResponse(res, 'System name is required', 400);
      }

      const systemData = {
        system_name,
        system_url,
        system_icon,
        system_order,
        created_by: createdBy,
      };

      const system = await this.systemsRepository.createSystem(systemData);

      return successResponse(res, system, 'System created successfully', 201);
    } catch (error) {
      console.error('Error creating system:', error);
      return errorResponse(res, 'Failed to create system', 500);
    }
  }

  async getSystem(req, res) {
    try {
      const { id } = req.params;

      const system = await this.systemsRepository.findById(id);

      if (!system) {
        return errorResponse(res, 'System not found', 404);
      }

      return successResponse(res, system, 'System retrieved successfully');
    } catch (error) {
      console.error('Error getting system:', error);
      return errorResponse(res, 'Failed to retrieve system', 500);
    }
  }

  async listSystems(req, res) {
    try {
      const { page = 1, limit = 10, search = '' } = req.body;
      
      // Validate pagination parameters
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      
      if (pageNum < 1) {
        return errorResponse(res, 'Page must be greater than 0', 400);
      }
      
      if (limitNum < 1 || limitNum > 100) {
        return errorResponse(res, 'Limit must be between 1 and 100', 400);
      }

      const result = await this.systemsRepository.findAllActiveWithPagination(
        pageNum, 
        limitNum, 
        search
      );

      return res.status(200).json({
        success: true,
        message: 'Systems retrieved successfully',
        data: result.data,
        pagination: result.pagination,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error listing systems:', error);
      return errorResponse(res, 'Failed to retrieve systems', 500);
    }
  }

  async updateSystem(req, res) {
    try {
      const { id } = req.params;
      const { system_name, system_url, system_icon, system_order } = req.body;
      const updatedBy = req.user?.user_id;

      const system = await this.systemsRepository.findById(id);

      if (!system) {
        return errorResponse(res, 'System not found', 404);
      }

      const updateData = {
        updated_by: updatedBy,
      };

      if (system_name) updateData.system_name = system_name;
      if (system_url) updateData.system_url = system_url;
      if (system_icon) updateData.system_icon = system_icon;
      if (system_order) updateData.system_order = system_order;

      const updatedSystem = await this.systemsRepository.updateSystem(id, updateData);

      return successResponse(res, updatedSystem, 'System updated successfully');
    } catch (error) {
      console.error('Error updating system:', error);
      return errorResponse(res, 'Failed to update system', 500);
    }
  }

  async deleteSystem(req, res) {
    try {
      const { id } = req.params;
      const deletedBy = req.user?.user_id;

      const system = await this.systemsRepository.findById(id);

      if (!system) {
        return errorResponse(res, 'System not found', 404);
      }

      await this.systemsRepository.deleteSystem(id, deletedBy);

      return successResponse(res, null, 'System deleted successfully');
    } catch (error) {
      console.error('Error deleting system:', error);
      return errorResponse(res, 'Failed to delete system', 500);
    }
  }
}

module.exports = new SystemsHandler();