const { onBoardDocumentColumns, onBoardDocumentValidationRules } = require('./column')
const { validateRequest } = require('../../utils/validation')
const { successResponse, errorResponse } = require('../../utils/response')
const { parseStandardQuery } = require('../../utils/pagination')
const onBoardDocumentRepository = require('./postgre_repository')
const { sanitizeOnBoardDocumentData, validateOnBoardDocument } = require('./validation')
const { getUserInfoFromToken } = require('../../utils/sso')
const { generateMinioUpload } = require('../../utils/minio-upload')

class OnBoardDocumentHandler {
  /**
   * Get all on board documents with pagination and filtering (POST method)
   */
  async getOnBoardDocuments(req, res) {
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
          'on_board_document_name',
          'on_board_document_description',
          'created_at',
          'updated_at'
        ],
        defaultSort: ['created_at', 'desc'],
        searchableColumns: [
          'on_board_document_name',
          'on_board_document_description'
        ],
        allowedFilters: [
          'candidate_id',
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
      
      const result = await onBoardDocumentRepository.getOnBoardDocuments(queryParams)
      
      return successResponse(res, result, 'On board documents retrieved successfully')
    } catch (error) {
      console.error('Error getting on board documents:', error)
      return errorResponse(res, 'Failed to retrieve on board documents', 500)
    }
  }

  /**
   * Get on board document by ID
   */
  async getOnBoardDocumentById(req, res) {
    try {
      const { id } = req.params
      
      const onBoardDocument = await onBoardDocumentRepository.getOnBoardDocumentById(id)
      if (!onBoardDocument) {
        return errorResponse(res, 'On board document not found', 404)
      }
      
      return successResponse(res, onBoardDocument, 'On board document retrieved successfully')
    } catch (error) {
      console.error('Error getting on board document:', error)
      return errorResponse(res, 'Failed to retrieve on board document', 500)
    }
  }

  /**
   * Create new on board document with multipart/form-data support
   */
  async createOnBoardDocument(req, res) {
    try {
      // Support parameters from both query string (GET) and body (POST/multipart)
      const requestParams = {
        ...req.query,  // GET parameters
        ...req.body    // POST/multipart parameters
      }

      // Validate request
      const validation = validateRequest(requestParams, onBoardDocumentValidationRules.create, onBoardDocumentColumns)
      if (!validation.isValid) {
        return errorResponse(res, validation.errors, 400)
      }
      
      // Additional validation
      const documentValidation = validateOnBoardDocument(requestParams)
      if (!documentValidation.isValid) {
        return errorResponse(res, documentValidation.errors, 400)
      }
      
      // Sanitize data
      let onBoardDocumentData = sanitizeOnBoardDocumentData(requestParams)
      
      // Handle on_board_document_file upload to MinIO
      if (req.files && req.files.length > 0) {
        const fileFile = req.files.find(file => file.fieldname === 'on_board_document_file')
        if (fileFile) {
          try {
            const fileIndex = req.files.findIndex(file => file.fieldname === 'on_board_document_file')
            
            const uploadResult = await generateMinioUpload(
              req, 
              fileIndex,
              'on-board-documents/files',
              'on_board_document_file',
              '',
              {
                isWatermark: false,
                isPrivate: false,
                isContentType: false, // Allow any file type
                fileNames: '',
                compressImage: false,
                maxFileSize: 50 * 1024 * 1024 // 50MB max for on board document files
              }
            )
            
            if (uploadResult.status) {
              onBoardDocumentData.on_board_document_file = uploadResult.pathForDatabase
              console.log(`On board document file uploaded successfully: ${uploadResult.fileNames}`)
            } else {
              console.warn(`Failed to upload on board document file: ${uploadResult.error}`)
              // Continue without file if upload fails
            }
          } catch (error) {
            console.error('Error uploading on board document file:', error)
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
      
      const onBoardDocument = await onBoardDocumentRepository.createOnBoardDocument(onBoardDocumentData, userId)
      
      return successResponse(res, onBoardDocument, 'On board document created successfully', 201)
    } catch (error) {
      console.error('Error creating on board document:', error)
      
      // Provide more specific error message
      if (error.code === '23503') { // Foreign key constraint violation
        return errorResponse(res, 'Invalid candidate_id. Referenced record does not exist.', 400)
      }
      
      return errorResponse(res, 'Failed to create on board document', 500)
    }
  }

  /**
   * Update on board document with multipart/form-data support
   */
  async updateOnBoardDocument(req, res) {
    try {
      const { id } = req.params
      
      // Check if on board document exists
      const existingOnBoardDocument = await onBoardDocumentRepository.getOnBoardDocumentById(id)
      if (!existingOnBoardDocument) {
        return errorResponse(res, 'On board document not found', 404)
      }
      
      // Validate request
      const validation = validateRequest(req.body, onBoardDocumentValidationRules.update, onBoardDocumentColumns)
      if (!validation.isValid) {
        return errorResponse(res, validation.errors, 400)
      }
      
      // Additional validation
      const documentValidation = validateOnBoardDocument(req.body)
      if (!documentValidation.isValid) {
        return errorResponse(res, documentValidation.errors, 400)
      }
      
      // Sanitize data
      let updateData = sanitizeOnBoardDocumentData(req.body)
      
      // Handle on_board_document_file upload to MinIO (only if new file is uploaded)
      if (req.files && req.files.length > 0) {
        const fileFile = req.files.find(file => file.fieldname === 'on_board_document_file')
        if (fileFile) {
          try {
            const fileIndex = req.files.findIndex(file => file.fieldname === 'on_board_document_file')
            
            const uploadResult = await generateMinioUpload(
              req, 
              fileIndex,
              'on-board-documents/files',
              'on_board_document_file',
              existingOnBoardDocument.on_board_document_file || '',
              {
                isWatermark: false,
                isPrivate: false,
                isContentType: false, // Allow any file type
                fileNames: '',
                compressImage: false,
                maxFileSize: 50 * 1024 * 1024 // 50MB max for on board document files
              }
            )
            
            if (uploadResult.status) {
              updateData.on_board_document_file = uploadResult.pathForDatabase
              console.log(`On board document file uploaded successfully: ${uploadResult.fileNames}`)
            } else {
              console.warn(`Failed to upload on board document file: ${uploadResult.error}`)
              // Keep existing file if upload fails
              updateData.on_board_document_file = existingOnBoardDocument.on_board_document_file
            }
          } catch (error) {
            console.error('Error uploading on board document file:', error)
            // Keep existing file if upload fails
            updateData.on_board_document_file = existingOnBoardDocument.on_board_document_file
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
      
      const onBoardDocument = await onBoardDocumentRepository.updateOnBoardDocument(id, updateData, userId)
      
      return successResponse(res, onBoardDocument, 'On board document updated successfully')
    } catch (error) {
      console.error('Error updating on board document:', error)
      
      // Provide more specific error message
      if (error.code === '23503') { // Foreign key constraint violation
        return errorResponse(res, 'Invalid candidate_id. Referenced record does not exist.', 400)
      }
      
      return errorResponse(res, 'Failed to update on board document', 500)
    }
  }

  /**
   * Soft delete on board document
   */
  async deleteOnBoardDocument(req, res) {
    try {
      const { id } = req.params
      
      // Check if on board document exists
      const existingOnBoardDocument = await onBoardDocumentRepository.getOnBoardDocumentById(id)
      if (!existingOnBoardDocument) {
        return errorResponse(res, 'On board document not found', 404)
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
      
      await onBoardDocumentRepository.deleteOnBoardDocument(id, userId)
      
      return successResponse(res, null, 'On board document deleted successfully')
    } catch (error) {
      console.error('Error deleting on board document:', error)
      return errorResponse(res, 'Failed to delete on board document', 500)
    }
  }
}

module.exports = new OnBoardDocumentHandler()

