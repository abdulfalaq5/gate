const { islandsColumns, islandsValidationRules } = require('./column')
const { validateRequest } = require('../../utils/validation')
const { successResponse, errorResponse } = require('../../utils/response')
const { parseStandardQuery } = require('../../utils/pagination')
const { decodeToken } = require('../../utils/auth')
const islandsRepository = require('./postgre_repository')

class IslandHandler {
  /**
   * Get all islands with pagination and filtering
   */
  async getIslands(req, res) {
    console.log('='.repeat(80))
    console.log('[Handler] getIslands - FUNCTION CALLED')
    console.log('[Handler] req.method:', req.method)
    console.log('[Handler] req.url:', req.url)
    console.log('[Handler] req.path:', req.path)
    console.log('[Handler] req.originalUrl:', req.originalUrl)
    console.log('[Handler] Handler function started at:', new Date().toISOString())
    
    try {
      // STEP 1: Extract request parameters
      console.log('[Handler] STEP 1: Extracting request parameters...')
      const requestParams = {
        ...req.query,  // GET parameters
        ...req.body    // POST parameters
      }
      console.log('[Handler] requestParams:', JSON.stringify(requestParams, null, 2))
      
      // STEP 2: Create modified request
      console.log('[Handler] STEP 2: Creating modified request...')
      const modifiedReq = {
        ...req,
        query: requestParams
      }
      console.log('[Handler] Modified request created')

      // STEP 3: Parse query parameters
      console.log('[Handler] STEP 3: Parsing query parameters...')
      let queryParams
      try {
        queryParams = parseStandardQuery(modifiedReq, {
          allowedSortColumns: ['island_name', 'created_at', 'updated_at'],
          defaultSort: ['created_at', 'desc'],
          searchableColumns: ['island_name'],
          allowedFilters: ['island_name', 'is_delete'],
          dateColumn: 'created_at'
        })
        console.log('[Handler] Query params parsed successfully')
        console.log('[Handler] queryParams:', JSON.stringify(queryParams, null, 2))
      } catch (parseError) {
        console.error('[Handler] ERROR in parseStandardQuery:', parseError)
        console.error('[Handler] Parse error name:', parseError.name)
        console.error('[Handler] Parse error message:', parseError.message)
        console.error('[Handler] Parse error stack:', parseError.stack)
        throw parseError
      }
      
      // STEP 4: Call repository
      console.log('[Handler] STEP 4: Calling repository...')
      let result
      try {
        result = await islandsRepository.getIslands(queryParams)
        console.log('[Handler] Repository call completed successfully')
        console.log('[Handler] Result type:', typeof result)
        console.log('[Handler] Result keys:', result ? Object.keys(result) : 'null')
      } catch (repoError) {
        console.error('[Handler] ERROR in repository call:', repoError)
        console.error('[Handler] Repo error name:', repoError.name)
        console.error('[Handler] Repo error message:', repoError.message)
        console.error('[Handler] Repo error stack:', repoError.stack)
        throw repoError
      }
      
      // STEP 5: Send response
      console.log('[Handler] STEP 5: Sending response...')
      try {
        const response = successResponse(res, result, 'Islands retrieved successfully')
        console.log('[Handler] Response sent successfully')
        console.log('='.repeat(80))
        return response
      } catch (responseError) {
        console.error('[Handler] ERROR in successResponse:', responseError)
        console.error('[Handler] Response error stack:', responseError.stack)
        throw responseError
      }
    } catch (error) {
      console.error('[Handler] ERROR in getIslands handler:', error)
      console.error('[Handler] Error name:', error.name)
      console.error('[Handler] Error message:', error.message)
      console.error('[Handler] Error stack:', error.stack)
      console.log('='.repeat(80))
      return errorResponse(res, 'Failed to retrieve islands', 500)
    }
  }

  /**
   * Get island by ID
   */
  async getIslandById(req, res) {
    try {
      const { id } = req.params
      
      const island = await islandsRepository.getIslandById(id)
      if (!island) {
        return errorResponse(res, 'Island not found', 404)
      }
      
      return successResponse(res, island, 'Island retrieved successfully')
    } catch (error) {
      console.error('Error getting island:', error)
      return errorResponse(res, 'Failed to retrieve island', 500)
    }
  }

  /**
   * Create new island
   */
  async createIsland(req, res) {
    try {
      // Support parameters from both query string (GET) and body (POST)
      const requestParams = {
        ...req.query,  // GET parameters
        ...req.body    // POST parameters
      }

      // Validate request
      const validation = validateRequest(requestParams, islandsValidationRules.create, islandsColumns)
      if (!validation.isValid) {
        return errorResponse(res, validation.errors, 400)
      }
      
      // Get user_id or employee_id from token
      const userId = req.user?.user_id || req.user?.employee_id || decodeToken('created', req).created_by
      
      const islandData = {
        ...requestParams,
        created_by: userId
      }
      
      const island = await islandsRepository.createIsland(islandData)
      
      return successResponse(res, island, 'Island created successfully', 201)
    } catch (error) {
      console.error('Error creating island:', error)
      return errorResponse(res, 'Failed to create island', 500)
    }
  }

  /**
   * Update island
   */
  async updateIsland(req, res) {
    try {
      const { id } = req.params
      
      // Check if island exists
      const existingIsland = await islandsRepository.getIslandById(id)
      if (!existingIsland) {
        return errorResponse(res, 'Island not found', 404)
      }
      
      // Validate request
      const validation = validateRequest(req.body, islandsValidationRules.update, islandsColumns)
      if (!validation.isValid) {
        return errorResponse(res, validation.errors, 400)
      }
      
      // Get user_id or employee_id from token
      const userId = req.user?.user_id || req.user?.employee_id || decodeToken('updated', req).updated_by
      
      const updateData = {
        ...req.body,
        updated_by: userId,
        updated_at: new Date()
      }
      
      const island = await islandsRepository.updateIsland(id, updateData)
      
      return successResponse(res, island, 'Island updated successfully')
    } catch (error) {
      console.error('Error updating island:', error)
      return errorResponse(res, 'Failed to update island', 500)
    }
  }

  /**
   * Soft delete island
   */
  async deleteIsland(req, res) {
    try {
      const { id } = req.params
      
      // Check if island exists
      const existingIsland = await islandsRepository.getIslandById(id)
      if (!existingIsland) {
        return errorResponse(res, 'Island not found', 404)
      }
      
      // Get user_id or employee_id from token
      const userId = req.user?.user_id || req.user?.employee_id || decodeToken('deleted', req).deleted_by
      
      await islandsRepository.deleteIsland(id, userId)
      
      return successResponse(res, null, 'Island deleted successfully')
    } catch (error) {
      console.error('Error deleting island:', error)
      return errorResponse(res, 'Failed to delete island', 500)
    }
  }
}

module.exports = new IslandHandler()

