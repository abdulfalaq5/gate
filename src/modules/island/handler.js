const { islandsColumns, islandsValidationRules } = require('./column')
const { validateRequest } = require('../../utils/validation')
const { successResponse, errorResponse } = require('../../utils/response')
const { parseStandardQuery } = require('../../utils/pagination')
const { decodeToken } = require('../../utils/auth')
const jwtDecode = require('jwt-decode')
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
      console.log('[createIsland] Starting island creation')
      console.log('[createIsland] Request body:', JSON.stringify(req.body, null, 2))
      console.log('[createIsland] Request query:', JSON.stringify(req.query, null, 2))
      console.log('[createIsland] req.user:', JSON.stringify(req.user, null, 2))
      
      // Support parameters from both query string (GET) and body (POST)
      const requestParams = {
        ...req.query,  // GET parameters
        ...req.body    // POST parameters
      }

      console.log('[createIsland] requestParams:', JSON.stringify(requestParams, null, 2))

      // Validate request
      const validation = validateRequest(requestParams, islandsValidationRules.create, islandsColumns)
      if (!validation.isValid) {
        console.error('[createIsland] Validation failed:', validation.errors)
        return errorResponse(res, validation.errors, 400)
      }
      
      // Get user_id or employee_id from token
      // Try multiple sources: req.user (from middleware), then decode token directly
      let userId = null
      
      // First try req.user (if set by middleware)
      if (req.user?.user_id) {
        userId = req.user.user_id
        console.log('[createIsland] Using user_id from req.user:', userId)
      } else if (req.user?.employee_id) {
        userId = req.user.employee_id
        console.log('[createIsland] Using employee_id from req.user:', userId)
      } else {
        // Decode token directly using jwtDecode (same as verifyToken middleware)
        try {
          const token = req?.headers?.authorization?.split(' ')[1]
          if (token) {
            const decoded = jwtDecode(token)
            console.log('[createIsland] Decoded token:', JSON.stringify(decoded, null, 2))
            
            // Try user_id or employee_id from token payload
            userId = decoded?.user_id || decoded?.employee_id
            
            // Fallback to decodeToken function (uses sub field)
            if (!userId) {
              const decodedToken = decodeToken('created', req)
              userId = decodedToken?.created_by
              console.log('[createIsland] Using created_by from decodeToken:', userId)
            } else {
              console.log('[createIsland] Using user_id/employee_id from decoded token:', userId)
            }
          }
        } catch (decodeError) {
          console.error('[createIsland] Error decoding token:', decodeError)
        }
      }
      
      if (!userId || userId === '' || userId === 0) {
        console.error('[createIsland] No valid user ID found')
        return errorResponse(res, 'Unable to identify user from token', 401)
      }
      
      const islandData = {
        island_name: requestParams.island_name,
        created_by: userId,
        is_delete: false
      }
      
      console.log('[createIsland] Island data to insert:', JSON.stringify(islandData, null, 2))
      
      const island = await islandsRepository.createIsland(islandData)
      
      if (!island) {
        console.error('[createIsland] Repository returned null')
        return errorResponse(res, 'Failed to create island - no data returned', 500)
      }
      
      console.log('[createIsland] Island created successfully:', JSON.stringify(island, null, 2))
      return successResponse(res, island, 'Island created successfully', 201)
    } catch (error) {
      console.error('[createIsland] Error creating island:', error)
      console.error('[createIsland] Error name:', error.name)
      console.error('[createIsland] Error message:', error.message)
      console.error('[createIsland] Error stack:', error.stack)
      
      // Check for unique constraint violation
      if (error.code === '23505' || error.message?.includes('unique') || error.message?.includes('duplicate')) {
        return errorResponse(res, 'Island name already exists', 409)
      }
      
      // Return detailed error in development
      const errorMessage = process.env.NODE_ENV === 'development' 
        ? error.message || 'Failed to create island'
        : 'Failed to create island'
      
      return errorResponse(res, errorMessage, 500)
    }
  }

  /**
   * Update island
   */
  async updateIsland(req, res) {
    try {
      console.log('[updateIsland] Starting island update')
      console.log('[updateIsland] Island ID:', req.params.id)
      console.log('[updateIsland] Request body:', JSON.stringify(req.body, null, 2))
      console.log('[updateIsland] req.user:', JSON.stringify(req.user, null, 2))
      
      const { id } = req.params
      
      // Check if island exists
      const existingIsland = await islandsRepository.getIslandById(id)
      if (!existingIsland) {
        console.error('[updateIsland] Island not found:', id)
        return errorResponse(res, 'Island not found', 404)
      }
      
      console.log('[updateIsland] Existing island:', JSON.stringify(existingIsland, null, 2))
      
      // Validate request
      const validation = validateRequest(req.body, islandsValidationRules.update, islandsColumns)
      if (!validation.isValid) {
        console.error('[updateIsland] Validation failed:', validation.errors)
        return errorResponse(res, validation.errors, 400)
      }
      
      // Get user_id or employee_id from token
      let userId = null
      
      // First try req.user (if set by middleware)
      if (req.user?.user_id) {
        userId = req.user.user_id
        console.log('[updateIsland] Using user_id from req.user:', userId)
      } else if (req.user?.employee_id) {
        userId = req.user.employee_id
        console.log('[updateIsland] Using employee_id from req.user:', userId)
      } else {
        // Decode token directly using jwtDecode (same as verifyToken middleware)
        try {
          const token = req?.headers?.authorization?.split(' ')[1]
          if (token) {
            const decoded = jwtDecode(token)
            console.log('[updateIsland] Decoded token:', JSON.stringify(decoded, null, 2))
            
            // Try user_id or employee_id from token payload
            userId = decoded?.user_id || decoded?.employee_id
            
            // Fallback to decodeToken function (uses sub field)
            if (!userId) {
              const decodedToken = decodeToken('updated', req)
              userId = decodedToken?.updated_by
              console.log('[updateIsland] Using updated_by from decodeToken:', userId)
            } else {
              console.log('[updateIsland] Using user_id/employee_id from decoded token:', userId)
            }
          }
        } catch (decodeError) {
          console.error('[updateIsland] Error decoding token:', decodeError)
        }
      }
      
      if (!userId || userId === '' || userId === 0) {
        console.error('[updateIsland] No valid user ID found')
        return errorResponse(res, 'Unable to identify user from token', 401)
      }
      
      const updateData = {
        ...req.body,
        updated_by: userId,
        updated_at: new Date().toISOString()
      }
      
      console.log('[updateIsland] Update data:', JSON.stringify(updateData, null, 2))
      
      const island = await islandsRepository.updateIsland(id, updateData)
      
      if (!island) {
        console.error('[updateIsland] Repository returned null')
        return errorResponse(res, 'Failed to update island - no data returned', 500)
      }
      
      console.log('[updateIsland] Island updated successfully:', JSON.stringify(island, null, 2))
      return successResponse(res, island, 'Island updated successfully')
    } catch (error) {
      console.error('[updateIsland] Error updating island:', error)
      console.error('[updateIsland] Error name:', error.name)
      console.error('[updateIsland] Error message:', error.message)
      console.error('[updateIsland] Error stack:', error.stack)
      
      // Check for unique constraint violation
      if (error.code === '23505' || error.message?.includes('unique') || error.message?.includes('duplicate')) {
        return errorResponse(res, 'Island name already exists', 409)
      }
      
      // Return detailed error in development
      const errorMessage = process.env.NODE_ENV === 'development' 
        ? error.message || 'Failed to update island'
        : 'Failed to update island'
      
      return errorResponse(res, errorMessage, 500)
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

