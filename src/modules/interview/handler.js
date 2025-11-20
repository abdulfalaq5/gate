const { interviewColumns, interviewValidationRules } = require('./column')
const { validateRequest } = require('../../utils/validation')
const { successResponse, errorResponse } = require('../../utils/response')
const { parseStandardQuery } = require('../../utils/pagination')
const interviewRepository = require('./postgre_repository')
const { sanitizeInterviewData, sanitizeDetailInterviewData, validateDetailInterview } = require('./validation')

class InterviewHandler {
  /**
   * Get all candidates with pagination and filtering (POST method)
   * Endpoint ini mengambil data dari tabel candidates sesuai requirements
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
          'candidate_name',
          'candidate_email',
          'candidate_phone',
          'candidate_number',
          'candidate_city',
          'candidate_state',
          'candidate_country',
          'created_at',
          'updated_at'
        ],
        defaultSort: ['created_at', 'desc'],
        searchableColumns: [
          'candidate_name',
          'candidate_email',
          'candidate_phone',
          'candidate_number',
          'candidate_city',
          'candidate_state',
          'candidate_country'
        ],
        allowedFilters: [
          'candidate_name',
          'candidate_email',
          'candidate_phone',
          'candidate_number',
          'company_id',
          'department_id',
          'title_id',
          'candidate_city',
          'candidate_state',
          'candidate_country',
          'is_delete'
        ],
        dateColumn: 'created_at'
      })
      
      if (!queryParams || !queryParams.pagination) {
        return errorResponse(res, 'Invalid query parameters', 400)
      }
      
      const result = await interviewRepository.getCandidates(queryParams)
      
      return successResponse(res, result, 'Candidates retrieved successfully')
    } catch (error) {
      console.error('Error getting candidates:', error)
      return errorResponse(res, 'Failed to retrieve candidates', 500)
    }
  }

  /**
   * Get interview by ID with all relations
   */
  async getInterviewById(req, res) {
    try {
      const { id } = req.params
      
      const interview = await interviewRepository.getInterviewById(id)
      if (!interview) {
        return errorResponse(res, 'Interview not found', 404)
      }
      
      return successResponse(res, interview, 'Interview retrieved successfully')
    } catch (error) {
      console.error('Error getting interview:', error)
      return errorResponse(res, 'Failed to retrieve interview', 500)
    }
  }

  /**
   * Create new interview with detail_interviews
   */
  async createInterview(req, res) {
    try {
      const { schedule_interview_id, interviews } = req.body
      
      if (!interviews || !Array.isArray(interviews) || interviews.length === 0) {
        return errorResponse(res, 'Interviews array is required', 400)
      }
      
      // Get user ID from token
      const userId = req.user?.user_id || req.user?.employee_id
      if (!userId) {
        return errorResponse(res, 'User ID not found in token', 401)
      }
      
      const createdInterviews = []
      const errors = []
      
      // Process each interview
      for (const interviewData of interviews) {
        try {
          // Validate interview data
          const interviewPayload = {
            schedule_interview_id: schedule_interview_id || null,
            interview_company_value: interviewData.company_value || null,
            interview_comment: interviewData.comment || null,
            interview_total_score: interviewData.total_score ? String(interviewData.total_score) : null,
            interview_description: interviewData.description || null
          }
          
          const validation = validateRequest(interviewPayload, interviewValidationRules.create, interviewColumns)
          if (!validation.isValid) {
            if (validation.errors && Array.isArray(validation.errors)) {
              errors.push(...validation.errors)
            } else if (validation.errors) {
              errors.push(validation.errors)
            } else {
              errors.push('Validation failed')
            }
            continue
          }
          
          // Validate detail_interviews if provided
          const detailInterviews = interviewData.detail_interviews || []
          const detailErrors = []
          
          for (const detail of detailInterviews) {
            const sanitizedDetail = sanitizeDetailInterviewData(detail)
            const detailValidation = validateDetailInterview(sanitizedDetail)
            if (!detailValidation.isValid) {
              if (detailValidation.errors && Array.isArray(detailValidation.errors)) {
                detailErrors.push(...detailValidation.errors)
              } else if (detailValidation.errors) {
                detailErrors.push(detailValidation.errors)
              } else {
                detailErrors.push('Detail interview validation failed')
              }
            }
          }
          
          if (detailErrors.length > 0) {
            if (Array.isArray(detailErrors)) {
              errors.push(...detailErrors)
            } else {
              errors.push(detailErrors)
            }
            continue
          }
          
          // Sanitize interview data
          const sanitizedInterviewData = sanitizeInterviewData(interviewPayload)
          
          // Sanitize detail interviews
          const sanitizedDetailInterviews = detailInterviews.map(detail => sanitizeDetailInterviewData(detail))
          
          // Create interview
          const createdInterview = await interviewRepository.createInterview(
            sanitizedInterviewData,
            sanitizedDetailInterviews,
            userId
          )
          
          createdInterviews.push(createdInterview)
        } catch (error) {
          console.error('Error creating interview:', error)
          errors.push(error.message)
        }
      }
      
      if (errors.length > 0 && createdInterviews.length === 0) {
        return errorResponse(res, 'Failed to create interviews', 400, errors)
      }
      
      if (errors.length > 0) {
        return successResponse(res, createdInterviews, `Interviews created with some errors: ${errors.join(', ')}`, 201)
      }
      
      return successResponse(res, createdInterviews, 'Interviews created successfully', 201)
    } catch (error) {
      console.error('Error creating interview:', error)
      
      // Provide more specific error message
      if (error.code === '23503') { // Foreign key constraint violation
        return errorResponse(res, 'Invalid schedule_interview_id. Referenced record does not exist.', 400)
      }
      
      return errorResponse(res, 'Failed to create interview', 500)
    }
  }

  /**
   * Update interview with detail_interviews
   */
  async updateInterview(req, res) {
    try {
      const { id } = req.params
      const { schedule_interview_id, interviews } = req.body
      
      // Check if interview exists
      const existingInterview = await interviewRepository.getInterviewById(id)
      if (!existingInterview) {
        return errorResponse(res, 'Interview not found', 404)
      }
      
      // Get user ID from token
      const userId = req.user?.user_id || req.user?.employee_id
      if (!userId) {
        return errorResponse(res, 'User ID not found in token', 401)
      }
      
      // If interviews array is provided, use first interview
      let interviewData = {}
      let detailInterviews = []
      
      if (interviews && Array.isArray(interviews) && interviews.length > 0 && interviews[0]) {
        const interviewPayload = interviews[0]
        interviewData = {
          schedule_interview_id: schedule_interview_id !== undefined ? schedule_interview_id : existingInterview.schedule_interview_id,
          interview_company_value: interviewPayload.company_value !== undefined ? interviewPayload.company_value : existingInterview.interview_company_value,
          interview_comment: interviewPayload.comment !== undefined ? interviewPayload.comment : existingInterview.interview_comment,
          interview_total_score: interviewPayload.total_score !== undefined ? String(interviewPayload.total_score) : existingInterview.interview_total_score,
          interview_description: interviewPayload.description !== undefined ? interviewPayload.description : existingInterview.interview_description
        }
        detailInterviews = interviewPayload.detail_interviews || []
      } else {
        // Update only interview data if interviews array not provided
        interviewData = {
          schedule_interview_id: schedule_interview_id !== undefined ? schedule_interview_id : existingInterview.schedule_interview_id,
          interview_company_value: req.body.interview_company_value !== undefined ? req.body.interview_company_value : existingInterview.interview_company_value,
          interview_comment: req.body.interview_comment !== undefined ? req.body.interview_comment : existingInterview.interview_comment,
          interview_total_score: req.body.interview_total_score !== undefined ? String(req.body.interview_total_score) : existingInterview.interview_total_score,
          interview_description: req.body.interview_description !== undefined ? req.body.interview_description : existingInterview.interview_description
        }
      }
      
      // Validate interview data
      const validation = validateRequest(interviewData, interviewValidationRules.update, interviewColumns)
      if (!validation.isValid) {
        const validationErrors = validation.errors && Array.isArray(validation.errors) 
          ? validation.errors 
          : (validation.errors ? [validation.errors] : ['Validation failed'])
        return errorResponse(res, validationErrors, 400)
      }
      
      // Validate detail_interviews if provided
      if (detailInterviews.length > 0) {
        const detailErrors = []
        for (const detail of detailInterviews) {
          const sanitizedDetail = sanitizeDetailInterviewData(detail)
          const detailValidation = validateDetailInterview(sanitizedDetail)
          if (!detailValidation.isValid) {
            if (detailValidation.errors && Array.isArray(detailValidation.errors)) {
              detailErrors.push(...detailValidation.errors)
            } else if (detailValidation.errors) {
              detailErrors.push(detailValidation.errors)
            } else {
              detailErrors.push('Detail interview validation failed')
            }
          }
        }
        
        if (detailErrors.length > 0) {
          return errorResponse(res, detailErrors, 400)
        }
      }
      
      // Sanitize interview data
      const sanitizedInterviewData = sanitizeInterviewData(interviewData)
      
      // Sanitize detail interviews
      const sanitizedDetailInterviews = detailInterviews.map(detail => sanitizeDetailInterviewData(detail))
      
      const interview = await interviewRepository.updateInterview(
        id,
        sanitizedInterviewData,
        sanitizedDetailInterviews,
        userId
      )
      
      return successResponse(res, interview, 'Interview updated successfully')
    } catch (error) {
      console.error('Error updating interview:', error)
      
      // Provide more specific error message
      if (error.code === '23503') { // Foreign key constraint violation
        return errorResponse(res, 'Invalid schedule_interview_id. Referenced record does not exist.', 400)
      }
      
      return errorResponse(res, 'Failed to update interview', 500)
    }
  }

  /**
   * Soft delete interview
   */
  async deleteInterview(req, res) {
    try {
      const { id } = req.params
      
      // Check if interview exists
      const existingInterview = await interviewRepository.getInterviewById(id)
      if (!existingInterview) {
        return errorResponse(res, 'Interview not found', 404)
      }
      
      // Get user ID from token
      const userId = req.user?.user_id || req.user?.employee_id
      if (!userId) {
        return errorResponse(res, 'User ID not found in token', 401)
      }
      
      await interviewRepository.deleteInterview(id, userId)
      
      return successResponse(res, null, 'Interview deleted successfully')
    } catch (error) {
      console.error('Error deleting interview:', error)
      return errorResponse(res, 'Failed to delete interview', 500)
    }
  }
}

module.exports = new InterviewHandler()

