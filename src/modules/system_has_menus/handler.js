const SystemHasMenusRepository = require('./postgre_repository');
const { successResponse, errorResponse } = require('../../utils/response');
const { parseStandardQuery } = require('../../utils/pagination');
const { pgCore } = require('../../config/database');

class SystemHasMenusHandler {
  constructor() {
    this.systemHasMenusRepository = new SystemHasMenusRepository(pgCore);
  }

  async createSystemHasMenu(req, res) {
    try {
      const { system_id, menu_id } = req.body;
      const createdBy = req.user?.user_id;

      if (!system_id || !menu_id) {
        return errorResponse(res, 'System ID and Menu ID are required', 400);
      }

      // Check if relationship already exists
      const existingRecord = await this.systemHasMenusRepository.findById(system_id, menu_id);
      if (existingRecord) {
        return errorResponse(res, 'System-Menu relationship already exists', 409);
      }

      const recordData = {
        system_id,
        menu_id,
        created_by: createdBy,
      };

      const record = await this.systemHasMenusRepository.createSystemHasMenu(recordData);

      return successResponse(res, record, 'System-Menu relationship created successfully', 201);
    } catch (error) {
      console.error('Error creating system-menu relationship:', error);
      return errorResponse(res, 'Failed to create system-menu relationship', 500);
    }
  }

  async getSystemHasMenu(req, res) {
    try {
      const { system_id, menu_id } = req.params;

      const record = await this.systemHasMenusRepository.findById(system_id, menu_id);

      if (!record) {
        return errorResponse(res, 'System-Menu relationship not found', 404);
      }

      return successResponse(res, record, 'System-Menu relationship retrieved successfully');
    } catch (error) {
      console.error('Error getting system-menu relationship:', error);
      return errorResponse(res, 'Failed to retrieve system-menu relationship', 500);
    }
  }

  async listSystemHasMenus(req, res) {
    try {
      // Parse query parameters dengan konfigurasi untuk systemHasMenus
      const queryParams = parseStandardQuery(req, {
        allowedSortColumns: ['system_name', 'menu_name', 'created_at', 'updated_at'],
        defaultSort: ['created_at', 'desc'],
        searchableColumns: ['system_name', 'menu_name'],
        allowedFilters: ['system_id', 'menu_id'],
        dateColumn: 'created_at'
      });

      // Gunakan method dengan filter standar
      const result = await this.systemHasMenusRepository.findWithFilters(queryParams);

      return successResponse(res, result, 'System-Menu relationships retrieved successfully');
    } catch (error) {
      console.error('Error listing system-menu relationships:', error);
      return errorResponse(res, 'Failed to retrieve system-menu relationships', 500);
    }
  }

  async getMenusBySystem(req, res) {
    try {
      const { system_id } = req.params;

      const menus = await this.systemHasMenusRepository.findBySystemId(system_id);

      return successResponse(res, menus, 'Menus for system retrieved successfully');
    } catch (error) {
      console.error('Error getting menus by system:', error);
      return errorResponse(res, 'Failed to retrieve menus for system', 500);
    }
  }

  async getSystemsByMenu(req, res) {
    try {
      const { menu_id } = req.params;

      const systems = await this.systemHasMenusRepository.findByMenuId(menu_id);

      return successResponse(res, systems, 'Systems for menu retrieved successfully');
    } catch (error) {
      console.error('Error getting systems by menu:', error);
      return errorResponse(res, 'Failed to retrieve systems for menu', 500);
    }
  }

  async updateSystemHasMenu(req, res) {
    try {
      const { system_id, menu_id } = req.params;
      const updatedBy = req.user?.user_id;

      const record = await this.systemHasMenusRepository.findById(system_id, menu_id);

      if (!record) {
        return errorResponse(res, 'System-Menu relationship not found', 404);
      }

      const updateData = {
        updated_by: updatedBy,
      };

      const updatedRecord = await this.systemHasMenusRepository.updateSystemHasMenu(system_id, menu_id, updateData);

      return successResponse(res, updatedRecord, 'System-Menu relationship updated successfully');
    } catch (error) {
      console.error('Error updating system-menu relationship:', error);
      return errorResponse(res, 'Failed to update system-menu relationship', 500);
    }
  }

  async deleteSystemHasMenu(req, res) {
    try {
      const { system_id, menu_id } = req.params;

      const record = await this.systemHasMenusRepository.findById(system_id, menu_id);

      if (!record) {
        return errorResponse(res, 'System-Menu relationship not found', 404);
      }

      await this.systemHasMenusRepository.deleteSystemHasMenu(system_id, menu_id);

      return successResponse(res, null, 'System-Menu relationship deleted successfully');
    } catch (error) {
      console.error('Error deleting system-menu relationship:', error);
      return errorResponse(res, 'Failed to delete system-menu relationship', 500);
    }
  }

  async deleteBySystem(req, res) {
    try {
      const { system_id } = req.params;

      const deletedRecords = await this.systemHasMenusRepository.deleteBySystemId(system_id);

      return successResponse(res, { deleted_count: deletedRecords.length }, 'All system-menu relationships for system deleted successfully');
    } catch (error) {
      console.error('Error deleting system-menu relationships by system:', error);
      return errorResponse(res, 'Failed to delete system-menu relationships', 500);
    }
  }

  async deleteByMenu(req, res) {
    try {
      const { menu_id } = req.params;

      const deletedRecords = await this.systemHasMenusRepository.deleteByMenuId(menu_id);

      return successResponse(res, { deleted_count: deletedRecords.length }, 'All system-menu relationships for menu deleted successfully');
    } catch (error) {
      console.error('Error deleting system-menu relationships by menu:', error);
      return errorResponse(res, 'Failed to delete system-menu relationships', 500);
    }
  }
}

module.exports = new SystemHasMenusHandler();
