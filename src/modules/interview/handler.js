const { interviewColumns, interviewValidationRules } = require('./column')
const { validateRequest } = require('../../utils/validation')
const { successResponse, errorResponse } = require('../../utils/response')
const { parseStandardQuery } = require('../../utils/pagination')
const interviewRepository = require('./postgre_repository')
const { sanitizeInterviewData, sanitizeDetailInterviewData, validateDetailInterview } = require('./validation')
const { getUserInfoFromToken } = require('../../utils/sso')

class InterviewHandler {
  /**
   * Get all interviews with pagination and filtering (POST method)
   * Endpoint ini mengambil data dari tabel interviews beserta relasinya
   */
  async getCandidates(req, res) {
    console.log('\n\n')
    console.log('='.repeat(80))
    console.log('[getCandidates] ========== HANDLER CALLED ==========')
    console.log('[getCandidates] Request received at:', new Date().toISOString())
    console.log('[getCandidates] Request method:', req.method)
    console.log('[getCandidates] Request path:', req.path)
    console.log('[getCandidates] Request query:', JSON.stringify(req.query, null, 2))
    console.log('[getCandidates] Request body:', JSON.stringify(req.body, null, 2))
    console.log('='.repeat(80))
    console.log('\n')
    
    try {
      // Support parameters from both query string (GET) and body (POST)
      console.log('[getCandidates] Merging request parameters...')
      const requestParams = {
        ...req.query,  // GET parameters
        ...req.body    // POST parameters
      }
      console.log('[getCandidates] Merged requestParams:', JSON.stringify(requestParams, null, 2))
      
      // Create a modified request object for parseStandardQuery
      console.log('[getCandidates] Creating modified request object...')
      const modifiedReq = {
        ...req,
        query: requestParams
      }
      console.log('[getCandidates] Modified request created')

      // Parse query parameters menggunakan sistem filter standar
      console.log('[getCandidates] Calling parseStandardQuery...')
      let queryParams
      try {
        queryParams = parseStandardQuery(modifiedReq, {
        allowedSortColumns: [
          'interview_company_value',
          'interview_comment',
          'interview_total_score',
          'interview_description',
          'created_at',
          'updated_at'
        ],
        defaultSort: ['created_at', 'desc'],
        searchableColumns: [
          'interview_company_value',
          'interview_comment',
          'interview_total_score',
          'interview_description'
        ],
        allowedFilters: [
          'schedule_interview_id',
          'employee_id',
          'interview_company_value',
          'interview_comment',
          'interview_total_score',
          'interview_description',
          'is_delete'
        ],
        dateColumn: 'created_at'
      })
      console.log('[getCandidates] ✅ parseStandardQuery completed')
      console.log('[getCandidates] queryParams:', JSON.stringify(queryParams, null, 2))
      } catch (parseError) {
        console.error('[getCandidates] ❌ Error in parseStandardQuery:', parseError)
        console.error('[getCandidates] Parse error name:', parseError?.name)
        console.error('[getCandidates] Parse error message:', parseError?.message)
        console.error('[getCandidates] Parse error stack:', parseError?.stack)
        throw parseError
      }
      
      if (!queryParams) {
        console.error('[getCandidates] ❌ queryParams is null or undefined after parseStandardQuery')
        return errorResponse(res, 'Invalid query parameters', 400)
      }
      
      // Ensure pagination exists
      if (!queryParams.pagination) {
        queryParams.pagination = {
          page: requestParams.page || 1,
          limit: requestParams.limit || 10,
          offset: ((requestParams.page || 1) - 1) * (requestParams.limit || 10)
        }
      }
      
      // Ensure all required properties exist
      if (!queryParams.sorting) {
        queryParams.sorting = { sortBy: 'created_at', sortOrder: 'desc' }
      }
      if (!queryParams.search) {
        queryParams.search = { searchTerm: '', searchableColumns: [] }
      }
      if (!queryParams.filters) {
        queryParams.filters = {}
      }
      if (!queryParams.dateRange) {
        queryParams.dateRange = { startDate: null, endDate: null, dateColumn: 'created_at' }
      }
      
      console.log('[getCandidates] ========== CALLING REPOSITORY ==========')
      console.log('[getCandidates] Calling repository.getInterviews with queryParams:', JSON.stringify(queryParams, null, 2))
      
      let result
      try {
        console.log('[getCandidates] Awaiting repository.getInterviews...')
        result = await interviewRepository.getInterviews(queryParams)
        console.log('[getCandidates] ✅ Repository call completed')
        console.log('[getCandidates] Result type:', typeof result)
        console.log('[getCandidates] Result:', JSON.stringify(result, null, 2))
      } catch (error) {
        console.error('[getCandidates] ❌ Error calling repository:', error)
        console.error('[getCandidates] Error name:', error?.name)
        console.error('[getCandidates] Error message:', error?.message)
        console.error('[getCandidates] Error stack:', error.stack)
        throw error
      }
      
      // Validasi result
      console.log('[getCandidates] Validating result...')
      if (!result) {
        console.error('[getCandidates] ❌ Result is null or undefined:', result)
        return errorResponse(res, 'Invalid response from server', 500)
      }
      
      if (typeof result !== 'object') {
        console.error('[getCandidates] ❌ Result is not an object:', typeof result, result)
        return errorResponse(res, 'Invalid response from server', 500)
      }
      
      console.log('[getCandidates] ✅ Result validated')
      console.log('[getCandidates] result.data type:', typeof result.data)
      console.log('[getCandidates] result.data isArray:', Array.isArray(result.data))
      console.log('[getCandidates] result.data length:', Array.isArray(result.data) ? result.data.length : 'N/A')
      console.log('[getCandidates] result.pagination:', result.pagination)
      
      console.log('[getCandidates] Successfully retrieved interviews, count:', result?.data?.length || 0)
      console.log('[getCandidates] ========== RETURNING SUCCESS RESPONSE ==========')
      
      console.log('[getCandidates] ========== RETURNING SUCCESS RESPONSE ==========')
      return successResponse(res, result, 'Interviews retrieved successfully')
    } catch (error) {
      console.error('\n')
      console.error('='.repeat(80))
      console.error('[getCandidates] ❌❌❌ ERROR CAUGHT ❌❌❌')
      console.error('[getCandidates] Error name:', error?.name)
      console.error('[getCandidates] Error message:', error?.message)
      console.error('[getCandidates] Error type:', typeof error)
      console.error('[getCandidates] Error constructor:', error?.constructor?.name)
      console.error('[getCandidates] Error stack:', error.stack)
      if (error.cause) {
        console.error('[getCandidates] Error cause:', error.cause)
      }
      console.error('='.repeat(80))
      console.error('\n')
      
      const errorMessage = error.message || 'Failed to retrieve interviews'
      return errorResponse(res, errorMessage, 500)
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
      let userId = req.user?.user_id || req.user?.employee_id
      
      // If user_id not found in req.user, try to get from SSO endpoint
      if (!userId) {
        try {
          const token = req.headers.authorization
          if (token) {
            const userInfo = await getUserInfoFromToken(token)
            userId = userInfo.user_id || userInfo.employee_id
          }
        } catch (error) {
          console.error('Error getting user info from token:', error)
          return errorResponse(res, 'User ID not found in token', 401)
        }
      }
      
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
      let userId = req.user?.user_id || req.user?.employee_id
      
      // If user_id not found in req.user, try to get from SSO endpoint
      if (!userId) {
        try {
          const token = req.headers.authorization
          if (token) {
            const userInfo = await getUserInfoFromToken(token)
            userId = userInfo.user_id || userInfo.employee_id
          }
        } catch (error) {
          console.error('Error getting user info from token:', error)
          return errorResponse(res, 'User ID not found in token', 401)
        }
      }
      
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
      let userId = req.user?.user_id || req.user?.employee_id
      
      // If user_id not found in req.user, try to get from SSO endpoint
      if (!userId) {
        try {
          const token = req.headers.authorization
          if (token) {
            const userInfo = await getUserInfoFromToken(token)
            userId = userInfo.user_id || userInfo.employee_id
          }
        } catch (error) {
          console.error('Error getting user info from token:', error)
          return errorResponse(res, 'User ID not found in token', 401)
        }
      }
      
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

