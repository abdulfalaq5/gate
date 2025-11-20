const { backgroundCheckColumns, backgroundCheckValidationRules } = require('./column')
const { validateRequest } = require('../../utils/validation')
const { successResponse, errorResponse } = require('../../utils/response')
const { parseStandardQuery } = require('../../utils/pagination')
const backgroundCheckRepository = require('./postgre_repository')
const { sanitizeBackgroundCheckData, validateBackgroundCheck } = require('./validation')
const { getUserInfoFromToken } = require('../../utils/sso')
const { generateMinioUpload } = require('../../utils/minio-upload')

class BackgroundCheckHandler {
  /**
   * Get all background checks with pagination and filtering (POST method)
   */
  async getBackgroundChecks(req, res) {
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
          'background_check_note',
          'background_status',
          'background_description',
          'created_at',
          'updated_at'
        ],
        defaultSort: ['created_at', 'desc'],
        searchableColumns: [
          'background_check_note',
          'background_description'
        ],
        allowedFilters: [
          'candidate_id',
          'background_status',
          'is_delete'
        ],
        dateColumn: 'created_at'
      })
      
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
      
      const result = await backgroundCheckRepository.getBackgroundChecks(queryParams)
      
      return successResponse(res, result, 'Background checks retrieved successfully')
    } catch (error) {
      console.error('Error getting background checks:', error)
      return errorResponse(res, 'Failed to retrieve background checks', 500)
    }
  }

  /**
   * Get background check by ID
   */
  async getBackgroundCheckById(req, res) {
    try {
      const { id } = req.params
      
      const backgroundCheck = await backgroundCheckRepository.getBackgroundCheckById(id)
      if (!backgroundCheck) {
        return errorResponse(res, 'Background check not found', 404)
      }
      
      return successResponse(res, backgroundCheck, 'Background check retrieved successfully')
    } catch (error) {
      console.error('Error getting background check:', error)
      return errorResponse(res, 'Failed to retrieve background check', 500)
    }
  }

  /**
   * Create new background check with multipart/form-data support
   */
  async createBackgroundCheck(req, res) {
    try {
      // Support parameters from both query string (GET) and body (POST/multipart)
      const requestParams = {
        ...req.query,  // GET parameters
        ...req.body    // POST/multipart parameters
      }

      // Validate request
      const validation = validateRequest(requestParams, backgroundCheckValidationRules.create, backgroundCheckColumns)
      if (!validation.isValid) {
        return errorResponse(res, validation.errors, 400)
      }
      
      // Additional validation for background_status
      const statusValidation = validateBackgroundCheck(requestParams)
      if (!statusValidation.isValid) {
        return errorResponse(res, statusValidation.errors, 400)
      }
      
      // Sanitize data
      let backgroundCheckData = sanitizeBackgroundCheckData(requestParams)
      
      // Handle background_file upload to MinIO
      if (req.files && req.files.length > 0) {
        const fileFile = req.files.find(file => file.fieldname === 'background_file')
        if (fileFile) {
          try {
            const fileIndex = req.files.findIndex(file => file.fieldname === 'background_file')
            
            const uploadResult = await generateMinioUpload(
              req, 
              fileIndex,
              'background-check/files',
              'background_check_file',
              '',
              {
                isWatermark: false,
                isPrivate: false,
                isContentType: false, // Allow any file type
                fileNames: '',
                compressImage: false,
                maxFileSize: 50 * 1024 * 1024 // 50MB max for background check files
              }
            )
            
            if (uploadResult.status) {
              backgroundCheckData.background_file = uploadResult.pathForDatabase
              console.log(`Background check file uploaded successfully: ${uploadResult.fileNames}`)
            } else {
              console.warn(`Failed to upload background check file: ${uploadResult.error}`)
              // Continue without file if upload fails
            }
          } catch (error) {
            console.error('Error uploading background check file:', error)
            // Continue without file if upload fails
          }
        }
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
      
      const backgroundCheck = await backgroundCheckRepository.createBackgroundCheck(backgroundCheckData, userId)
      
      return successResponse(res, backgroundCheck, 'Background check created successfully', 201)
    } catch (error) {
      console.error('Error creating background check:', error)
      
      // Provide more specific error message
      if (error.code === '23503') { // Foreign key constraint violation
        return errorResponse(res, 'Invalid candidate_id. Referenced record does not exist.', 400)
      }
      
      return errorResponse(res, 'Failed to create background check', 500)
    }
  }

  /**
   * Update background check with multipart/form-data support
   */
  async updateBackgroundCheck(req, res) {
    try {
      const { id } = req.params
      
      // Check if background check exists
      const existingBackgroundCheck = await backgroundCheckRepository.getBackgroundCheckById(id)
      if (!existingBackgroundCheck) {
        return errorResponse(res, 'Background check not found', 404)
      }
      
      // Validate request
      const validation = validateRequest(req.body, backgroundCheckValidationRules.update, backgroundCheckColumns)
      if (!validation.isValid) {
        return errorResponse(res, validation.errors, 400)
      }
      
      // Additional validation for background_status
      const statusValidation = validateBackgroundCheck(req.body)
      if (!statusValidation.isValid) {
        return errorResponse(res, statusValidation.errors, 400)
      }
      
      // Sanitize data
      let updateData = sanitizeBackgroundCheckData(req.body)
      
      // Handle background_file upload to MinIO (only if new file is uploaded)
      if (req.files && req.files.length > 0) {
        const fileFile = req.files.find(file => file.fieldname === 'background_file')
        if (fileFile) {
          try {
            const fileIndex = req.files.findIndex(file => file.fieldname === 'background_file')
            
            const uploadResult = await generateMinioUpload(
              req, 
              fileIndex,
              'background-check/files',
              'background_check_file',
              existingBackgroundCheck.background_file || '',
              {
                isWatermark: false,
                isPrivate: false,
                isContentType: false, // Allow any file type
                fileNames: '',
                compressImage: false,
                maxFileSize: 50 * 1024 * 1024 // 50MB max for background check files
              }
            )
            
            if (uploadResult.status) {
              updateData.background_file = uploadResult.pathForDatabase
              console.log(`Background check file uploaded successfully: ${uploadResult.fileNames}`)
            } else {
              console.warn(`Failed to upload background check file: ${uploadResult.error}`)
              // Keep existing file if upload fails
              updateData.background_file = existingBackgroundCheck.background_file
            }
          } catch (error) {
            console.error('Error uploading background check file:', error)
            // Keep existing file if upload fails
            updateData.background_file = existingBackgroundCheck.background_file
          }
        }
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
      
      const backgroundCheck = await backgroundCheckRepository.updateBackgroundCheck(id, updateData, userId)
      
      return successResponse(res, backgroundCheck, 'Background check updated successfully')
    } catch (error) {
      console.error('Error updating background check:', error)
      
      // Provide more specific error message
      if (error.code === '23503') { // Foreign key constraint violation
        return errorResponse(res, 'Invalid candidate_id. Referenced record does not exist.', 400)
      }
      
      return errorResponse(res, 'Failed to update background check', 500)
    }
  }

  /**
   * Soft delete background check
   */
  async deleteBackgroundCheck(req, res) {
    try {
      const { id } = req.params
      
      // Check if background check exists
      const existingBackgroundCheck = await backgroundCheckRepository.getBackgroundCheckById(id)
      if (!existingBackgroundCheck) {
        return errorResponse(res, 'Background check not found', 404)
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
      
      await backgroundCheckRepository.deleteBackgroundCheck(id, userId)
      
      return successResponse(res, null, 'Background check deleted successfully')
    } catch (error) {
      console.error('Error deleting background check:', error)
      return errorResponse(res, 'Failed to delete background check', 500)
    }
  }
}

module.exports = new BackgroundCheckHandler()

