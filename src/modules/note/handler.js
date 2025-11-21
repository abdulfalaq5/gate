const { noteColumns, noteValidationRules } = require('./column')
const { validateRequest } = require('../../utils/validation')
const { successResponse, errorResponse } = require('../../utils/response')
const { parseStandardQuery } = require('../../utils/pagination')
const noteRepository = require('./postgre_repository')
const { sanitizeNoteData, validateNote } = require('./validation')
const { getUserInfoFromToken } = require('../../utils/sso')

class NoteHandler {
  /**
   * Get all notes with pagination and filtering (POST method)
   */
  async getNotes(req, res) {
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
          'notes',
          'noted_description',
          'created_at',
          'updated_at'
        ],
        defaultSort: ['created_at', 'desc'],
        searchableColumns: [
          'notes',
          'noted_description'
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
      
      const result = await noteRepository.getNotes(queryParams)
      
      return successResponse(res, result, 'Notes retrieved successfully')
    } catch (error) {
      console.error('Error getting notes:', error)
      return errorResponse(res, 'Failed to retrieve notes', 500)
    }
  }

  /**
   * Get note by ID
   */
  async getNoteById(req, res) {
    try {
      const { id } = req.params
      
      const note = await noteRepository.getNoteById(id)
      if (!note) {
        return errorResponse(res, 'Note not found', 404)
      }
      
      return successResponse(res, note, 'Note retrieved successfully')
    } catch (error) {
      console.error('Error getting note:', error)
      return errorResponse(res, 'Failed to retrieve note', 500)
    }
  }

  /**
   * Create new note
   */
  async createNote(req, res) {
    try {
      // Support parameters from both query string (GET) and body (POST)
      const requestParams = {
        ...req.query,  // GET parameters
        ...req.body    // POST parameters
      }

      // Validate request
      const validation = validateRequest(requestParams, noteValidationRules.create, noteColumns)
      if (!validation.isValid) {
        return errorResponse(res, validation.errors, 400)
      }
      
      // Additional validation
      const noteValidation = validateNote(requestParams)
      if (!noteValidation.isValid) {
        return errorResponse(res, noteValidation.errors, 400)
      }
      
      // Sanitize data
      let noteData = sanitizeNoteData(requestParams)
      
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
      
      const note = await noteRepository.createNote(noteData, userId)
      
      return successResponse(res, note, 'Note created successfully', 201)
    } catch (error) {
      console.error('Error creating note:', error)
      
      // Provide more specific error message
      if (error.code === '23503') { // Foreign key constraint violation
        return errorResponse(res, 'Invalid candidate_id. Referenced record does not exist.', 400)
      }
      
      return errorResponse(res, 'Failed to create note', 500)
    }
  }

  /**
   * Update note
   */
  async updateNote(req, res) {
    try {
      const { id } = req.params
      
      // Check if note exists
      const existingNote = await noteRepository.getNoteById(id)
      if (!existingNote) {
        return errorResponse(res, 'Note not found', 404)
      }
      
      // Validate request
      const validation = validateRequest(req.body, noteValidationRules.update, noteColumns)
      if (!validation.isValid) {
        return errorResponse(res, validation.errors, 400)
      }
      
      // Additional validation
      const noteValidation = validateNote(req.body)
      if (!noteValidation.isValid) {
        return errorResponse(res, noteValidation.errors, 400)
      }
      
      // Sanitize data
      let updateData = sanitizeNoteData(req.body)
      
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
      
      const note = await noteRepository.updateNote(id, updateData, userId)
      
      return successResponse(res, note, 'Note updated successfully')
    } catch (error) {
      console.error('Error updating note:', error)
      
      // Provide more specific error message
      if (error.code === '23503') { // Foreign key constraint violation
        return errorResponse(res, 'Invalid candidate_id. Referenced record does not exist.', 400)
      }
      
      return errorResponse(res, 'Failed to update note', 500)
    }
  }

  /**
   * Soft delete note
   */
  async deleteNote(req, res) {
    try {
      const { id } = req.params
      
      // Check if note exists
      const existingNote = await noteRepository.getNoteById(id)
      if (!existingNote) {
        return errorResponse(res, 'Note not found', 404)
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
      
      await noteRepository.deleteNote(id, userId)
      
      return successResponse(res, null, 'Note deleted successfully')
    } catch (error) {
      console.error('Error deleting note:', error)
      return errorResponse(res, 'Failed to delete note', 500)
    }
  }
}

module.exports = new NoteHandler()

