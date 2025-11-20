const { scheduleInterviewColumns, scheduleInterviewValidationRules } = require('./column')
const { validateRequest } = require('../../utils/validation')
const { successResponse, errorResponse } = require('../../utils/response')
const { parseStandardQuery } = require('../../utils/pagination')
const scheduleInterviewRepository = require('./postgre_repository')
const { sanitizeScheduleInterviewData } = require('./validation')

class ScheduleInterviewHandler {
  /**
   * Get all schedule interviews with pagination and filtering (POST method)
   * Endpoint ini mengambil data dari tabel schedule_interviews beserta relasinya
   */
  async getCandidates(req, res) {
    try {
      // Support parameters from both query string (GET) and body (POST)
      const requestParams = {
        ...req.query,  // GET parameters
        ...req.body    // POST parameters
      }
      
      // Create a modified request object for parseStandardQuery
      const modifiedReq = {
        ...req,
        query: requestParams
      }

      // Parse query parameters menggunakan sistem filter standar
      const queryParams = parseStandardQuery(modifiedReq, {
        allowedSortColumns: [
          'schedule_interview_date',
          'schedule_interview_time',
          'assign_role',
          'created_at',
          'updated_at'
        ],
        defaultSort: ['created_at', 'desc'],
        searchableColumns: [
          'assign_role',
          'schedule_interview_duration',
          'schedule_interview_description'
        ],
        allowedFilters: [
          'candidate_id',
          'assign_role',
          'schedule_interview_date',
          'is_delete'
        ],
        dateColumn: 'created_at'
      })
      
      const result = await scheduleInterviewRepository.getScheduleInterviews(queryParams)
      
      return successResponse(res, result, 'Schedule interviews retrieved successfully')
    } catch (error) {
      console.error('Error getting schedule interviews:', error)
      return errorResponse(res, 'Failed to retrieve schedule interviews', 500)
    }
  }

  /**
   * Get schedule interview by ID with all relations
   */
  async getScheduleInterviewById(req, res) {
    try {
      const { id } = req.params
      
      const scheduleInterview = await scheduleInterviewRepository.getScheduleInterviewById(id)
      if (!scheduleInterview) {
        return errorResponse(res, 'Schedule interview not found', 404)
      }
      
      return successResponse(res, scheduleInterview, 'Schedule interview retrieved successfully')
    } catch (error) {
      console.error('Error getting schedule interview:', error)
      return errorResponse(res, 'Failed to retrieve schedule interview', 500)
    }
  }

  /**
   * Create new schedule interview
   */
  async createScheduleInterview(req, res) {
    try {
      // Support parameters from both query string (GET) and body (POST)
      const requestParams = {
        ...req.query,  // GET parameters
        ...req.body    // POST parameters
      }

      // Validate request
      const validation = validateRequest(requestParams, scheduleInterviewValidationRules.create, scheduleInterviewColumns)
      if (!validation.isValid) {
        return errorResponse(res, validation.errors, 400)
      }
      
      // Sanitize data
      let scheduleInterviewData = sanitizeScheduleInterviewData(requestParams)
      
      // Set created_by from token
      scheduleInterviewData.created_by = req.user?.user_id || req.user?.employee_id
      
      const scheduleInterview = await scheduleInterviewRepository.createScheduleInterview(scheduleInterviewData)
      
      return successResponse(res, scheduleInterview, 'Schedule interview created successfully', 201)
    } catch (error) {
      console.error('Error creating schedule interview:', error)
      
      // Provide more specific error message
      if (error.code === '23503') { // Foreign key constraint violation
        return errorResponse(res, 'Invalid candidate_id. Referenced record does not exist.', 400)
      }
      
      return errorResponse(res, 'Failed to create schedule interview', 500)
    }
  }

  /**
   * Update schedule interview
   */
  async updateScheduleInterview(req, res) {
    try {
      const { id } = req.params
      
      // Check if schedule interview exists
      const existingScheduleInterview = await scheduleInterviewRepository.getScheduleInterviewById(id)
      if (!existingScheduleInterview) {
        return errorResponse(res, 'Schedule interview not found', 404)
      }
      
      // Validate request
      const validation = validateRequest(req.body, scheduleInterviewValidationRules.update, scheduleInterviewColumns)
      if (!validation.isValid) {
        return errorResponse(res, validation.errors, 400)
      }
      
      // Sanitize data
      let updateData = sanitizeScheduleInterviewData(req.body)
      
      // Set updated_by from token
      updateData.updated_by = req.user?.user_id || req.user?.employee_id
      
      const scheduleInterview = await scheduleInterviewRepository.updateScheduleInterview(id, updateData)
      
      return successResponse(res, scheduleInterview, 'Schedule interview updated successfully')
    } catch (error) {
      console.error('Error updating schedule interview:', error)
      
      // Provide more specific error message
      if (error.code === '23503') { // Foreign key constraint violation
        return errorResponse(res, 'Invalid candidate_id. Referenced record does not exist.', 400)
      }
      
      return errorResponse(res, 'Failed to update schedule interview', 500)
    }
  }

  /**
   * Soft delete schedule interview
   */
  async deleteScheduleInterview(req, res) {
    try {
      const { id } = req.params
      
      // Check if schedule interview exists
      const existingScheduleInterview = await scheduleInterviewRepository.getScheduleInterviewById(id)
      if (!existingScheduleInterview) {
        return errorResponse(res, 'Schedule interview not found', 404)
      }
      
      const deleteData = {
        is_delete: true,
        deleted_at: new Date(),
        deleted_by: req.user?.user_id || req.user?.employee_id
      }
      
      const result = await scheduleInterviewRepository.updateScheduleInterview(id, deleteData)
      
      return successResponse(res, null, 'Schedule interview deleted successfully')
    } catch (error) {
      console.error('Error deleting schedule interview:', error)
      return errorResponse(res, 'Failed to delete schedule interview', 500)
    }
  }
}

module.exports = new ScheduleInterviewHandler()

