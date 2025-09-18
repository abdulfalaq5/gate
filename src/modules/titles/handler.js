const TitlesRepository = require('./postgre_repository')
const { successResponse, errorResponse } = require('../../utils/response')
const { parseStandardQuery } = require('../../utils/pagination')
const { pgCore } = require('../../config/database')

class TitlesHandler {
  constructor() {
    this.titlesRepository = new TitlesRepository(pgCore);
  }

  /**
   * Get all titles with pagination and filtering (POST method for complex queries)
   */
  async getTitles(req, res) {
    try {
      // Support parameters from both query string (GET) and body (POST)
      const requestParams = {
        ...req.query,  // GET parameters
        ...req.body    // POST parameters
      };
      
      // Create a modified request object for parseStandardQuery
      const modifiedReq = {
        ...req,
        query: requestParams
      };

      // Parse query parameters dengan konfigurasi untuk titles
      const queryParams = parseStandardQuery(modifiedReq, {
        allowedSortColumns: ['title_name', 'department_id', 'created_at', 'updated_at'],
        defaultSort: ['title_name', 'asc'],
        searchableColumns: ['title_name'],
        allowedFilters: [
          'title_name',
          'department_id',
          'department_name',
          'created_by',
          'updated_by',
          'is_delete'
        ],
        dateColumn: 'created_at'
      });

      // Gunakan method baru dengan filter standar
      const result = await this.titlesRepository.findWithFilters(queryParams);

      return successResponse(res, result, 'Titles retrieved successfully')
    } catch (error) {
      console.error('Error getting titles:', error)
      return errorResponse(res, 'Failed to retrieve titles', 500)
    }
  }

  /**
   * Get title by ID
   */
  async getTitleById(req, res) {
    try {
      const { id } = req.params
      
      const title = await this.titlesRepository.getTitleById(id)
      if (!title) {
        return errorResponse(res, 'Title not found', 404)
      }
      
      return successResponse(res, title, 'Title retrieved successfully')
    } catch (error) {
      console.error('Error getting title:', error)
      return errorResponse(res, 'Failed to retrieve title', 500)
    }
  }

  /**
   * Create new title
   */
  async createTitle(req, res) {
    try {
      const titleData = {
        ...req.body,
        created_by: req.user?.user_id
      }
      
      const title = await this.titlesRepository.createTitle(titleData)
      
      return successResponse(res, title, 'Title created successfully', 201)
    } catch (error) {
      console.error('Error creating title:', error)
      return errorResponse(res, 'Failed to create title', 500)
    }
  }

  /**
   * Update title
   */
  async updateTitle(req, res) {
    try {
      const { id } = req.params
      
      const existingTitle = await this.titlesRepository.getTitleById(id)
      if (!existingTitle) {
        return errorResponse(res, 'Title not found', 404)
      }
      
      const updateData = {
        ...req.body,
        updated_by: req.user?.user_id,
        updated_at: new Date()
      }
      
      const title = await this.titlesRepository.updateTitle(id, updateData)
      
      return successResponse(res, title, 'Title updated successfully')
    } catch (error) {
      console.error('Error updating title:', error)
      return errorResponse(res, 'Failed to update title', 500)
    }
  }

  /**
   * Soft delete title
   */
  async deleteTitle(req, res) {
    try {
      const { id } = req.params
      
      const existingTitle = await this.titlesRepository.getTitleById(id)
      if (!existingTitle) {
        return errorResponse(res, 'Title not found', 404)
      }
      
      const deleteData = {
        is_delete: true,
        deleted_at: new Date(),
        deleted_by: req.user?.user_id
      }
      
      await this.titlesRepository.updateTitle(id, deleteData)
      
      return successResponse(res, null, 'Title deleted successfully')
    } catch (error) {
      console.error('Error deleting title:', error)
      return errorResponse(res, 'Failed to delete title', 500)
    }
  }

  /**
   * Get titles by department
   */
  async getTitlesByDepartment(req, res) {
    try {
      const { departmentId } = req.params
      
      const titles = await this.titlesRepository.getTitlesByDepartmentId(departmentId)
      
      return successResponse(res, titles, 'Titles retrieved successfully')
    } catch (error) {
      console.error('Error getting titles by department:', error)
      return errorResponse(res, 'Failed to retrieve titles', 500)
    }
  }
}

module.exports = new TitlesHandler();
