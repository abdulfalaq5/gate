const { pgCore } = require('../../config/database')
const { islandsColumns } = require('./column')
const { applyStandardFilters, buildCountQuery, formatSimplePaginatedResponse } = require('../../utils/query_builder')

/**
 * Get islands with pagination and filtering menggunakan sistem filter standar
 */
const getIslands = async (queryParams) => {
  console.log('='.repeat(80))
  console.log('[getIslands] STEP 1: Function started')
  console.log('[getIslands] queryParams type:', typeof queryParams)
  console.log('[getIslands] queryParams:', JSON.stringify(queryParams, null, 2))
  
  try {
    // STEP 2: Validate queryParams
    console.log('[getIslands] STEP 2: Validating queryParams...')
    if (!queryParams || typeof queryParams !== 'object') {
      console.warn('[getIslands] queryParams invalid, using defaults')
      queryParams = {
        pagination: { page: 1, limit: 10, offset: 0 },
        sorting: { sortBy: 'created_at', sortOrder: 'desc' },
        search: { searchTerm: '', searchableColumns: ['island_name'] },
        filters: {},
        dateRange: {}
      }
    }
    console.log('[getIslands] queryParams validated')
    
    // STEP 3: Create base query
    console.log('[getIslands] STEP 3: Creating base query...')
    const baseQuery = pgCore('islands').select('*').where('islands.is_delete', false)
    console.log('[getIslands] Base query created successfully')
    
    // STEP 4: Apply standard filters
    console.log('[getIslands] STEP 4: Applying standard filters...')
    let dataQuery
    try {
      dataQuery = applyStandardFilters(baseQuery.clone(), queryParams)
      console.log('[getIslands] Data query created successfully')
      console.log('[getIslands] Data query type:', typeof dataQuery)
    } catch (filterError) {
      console.error('[getIslands] ERROR in applyStandardFilters:', filterError)
      console.error('[getIslands] Filter error stack:', filterError.stack)
      throw filterError
    }
    
    // STEP 5: Build count query
    console.log('[getIslands] STEP 5: Building count query...')
    let countQuery
    try {
      countQuery = buildCountQuery(baseQuery, queryParams)
      console.log('[getIslands] Count query created successfully')
      console.log('[getIslands] Count query type:', typeof countQuery)
    } catch (countError) {
      console.error('[getIslands] ERROR in buildCountQuery:', countError)
      console.error('[getIslands] Count error stack:', countError.stack)
      throw countError
    }
    
    // STEP 6: Execute queries
    console.log('[getIslands] STEP 6: Executing Promise.all...')
    let results
    try {
      console.log('[getIslands] About to execute Promise.all')
      results = await Promise.all([
        dataQuery,
        countQuery.first()
      ])
      console.log('[getIslands] Promise.all completed successfully')
    } catch (promiseError) {
      console.error('[getIslands] ERROR in Promise.all:', promiseError)
      console.error('[getIslands] Promise.all error name:', promiseError.name)
      console.error('[getIslands] Promise.all error message:', promiseError.message)
      console.error('[getIslands] Promise.all error stack:', promiseError.stack)
      throw promiseError
    }
    
    // STEP 7: Validate and extract results
    console.log('[getIslands] STEP 7: Validating and extracting results...')
    console.log('[getIslands] results type:', typeof results)
    console.log('[getIslands] results isArray:', Array.isArray(results))
    console.log('[getIslands] results value:', results)
    
    if (!results) {
      console.error('[getIslands] ERROR: results is null/undefined')
      throw new Error('Promise.all returned null/undefined')
    }
    
    if (!Array.isArray(results)) {
      console.error('[getIslands] ERROR: results is not an array')
      console.error('[getIslands] results type:', typeof results)
      throw new Error(`Promise.all returned non-array: ${typeof results}`)
    }
    
    console.log('[getIslands] results.length:', results.length)
    
    if (results.length < 2) {
      console.error('[getIslands] ERROR: results.length < 2')
      console.error('[getIslands] results.length:', results.length)
      throw new Error(`Promise.all returned array with length ${results.length}, expected 2`)
    }
    
    console.log('[getIslands] results[0] type:', typeof results[0])
    console.log('[getIslands] results[0] isArray:', Array.isArray(results[0]))
    console.log('[getIslands] results[1] type:', typeof results[1])
    console.log('[getIslands] results[1] value:', JSON.stringify(results[1], null, 2))
    
    // Extract islands
    let islands = []
    if (Array.isArray(results[0])) {
      islands = results[0]
      console.log('[getIslands] Extracted islands, count:', islands.length)
            } else {
      console.warn('[getIslands] results[0] is not array, using empty array')
      console.warn('[getIslands] results[0] value:', results[0])
      islands = []
    }
    
    // Extract countResult
    let countResult = { total: 0 }
    if (results[1]) {
      countResult = results[1]
      console.log('[getIslands] Extracted countResult:', JSON.stringify(countResult, null, 2))
      } else {
      console.warn('[getIslands] results[1] is null/undefined, using default')
      countResult = { total: 0 }
    }
    
    // STEP 8: Extract total
    console.log('[getIslands] STEP 8: Extracting total count...')
    console.log('[getIslands] countResult:', JSON.stringify(countResult, null, 2))
    console.log('[getIslands] countResult?.total:', countResult?.total)
    const total = countResult && countResult.total !== undefined 
      ? parseInt(countResult.total) || 0 
      : 0
    console.log('[getIslands] Extracted total:', total)
    
    // STEP 9: Ensure pagination
    console.log('[getIslands] STEP 9: Ensuring pagination...')
    const pagination = queryParams?.pagination || { page: 1, limit: 10 }
    console.log('[getIslands] Pagination:', JSON.stringify(pagination, null, 2))
    
    // STEP 10: Format response
    console.log('[getIslands] STEP 10: Formatting response...')
    console.log('[getIslands] Calling formatSimplePaginatedResponse with:')
    console.log('[getIslands] - islands:', Array.isArray(islands) ? `Array(${islands.length})` : islands)
    console.log('[getIslands] - pagination:', JSON.stringify(pagination, null, 2))
    console.log('[getIslands] - total:', total)
    
    try {
      const response = formatSimplePaginatedResponse(islands, pagination, total)
      console.log('[getIslands] Response formatted successfully')
      console.log('[getIslands] Response keys:', Object.keys(response))
      console.log('='.repeat(80))
      return response
    } catch (formatError) {
      console.error('[getIslands] ERROR in formatSimplePaginatedResponse:', formatError)
      console.error('[getIslands] Format error name:', formatError.name)
      console.error('[getIslands] Format error message:', formatError.message)
      console.error('[getIslands] Format error stack:', formatError.stack)
      throw formatError
    }
  } catch (error) {
    console.error('[getIslands] ERROR in getIslands:', error)
    console.error('[getIslands] Error name:', error.name)
    console.error('[getIslands] Error message:', error.message)
    console.error('[getIslands] Error stack:', error.stack)
    console.log('='.repeat(80))
    // Return safe default response
    const pagination = queryParams?.pagination || { page: 1, limit: 10 }
    return formatSimplePaginatedResponse([], pagination, 0)
  }
}

/**
 * Get island by ID
 */
const getIslandById = async (id) => {
  try {
    const result = await pgCore('islands')
      .select('*')
      .where('island_id', id)
      .where('is_delete', false)
    
    // Handle result - could be array or single object
    if (Array.isArray(result)) {
      return result.length > 0 ? result[0] : null
    }
    return result || null
  } catch (error) {
    console.error('Error in getIslandById:', error)
    throw error
  }
}

/**
 * Create new island
 */
const createIsland = async (islandData) => {
  try {
    console.log('[createIsland Repository] Starting insert')
    console.log('[createIsland Repository] Island data:', JSON.stringify(islandData, null, 2))
    
    const result = await pgCore('islands')
      .insert(islandData)
      .returning('*')
    
    console.log('[createIsland Repository] Insert result:', JSON.stringify(result, null, 2))
    console.log('[createIsland Repository] Result type:', typeof result)
    console.log('[createIsland Repository] Is array:', Array.isArray(result))
    
    // Handle result - could be array or single object
    if (Array.isArray(result)) {
      const island = result.length > 0 ? result[0] : null
      console.log('[createIsland Repository] Returning island:', island ? 'found' : 'null')
      return island
    }
    
    const island = result || null
    console.log('[createIsland Repository] Returning island (non-array):', island ? 'found' : 'null')
    return island
  } catch (error) {
    console.error('[createIsland Repository] Error in createIsland:', error)
    console.error('[createIsland Repository] Error code:', error.code)
    console.error('[createIsland Repository] Error message:', error.message)
    console.error('[createIsland Repository] Error detail:', error.detail)
    console.error('[createIsland Repository] Error stack:', error.stack)
    throw error
  }
}

/**
 * Update island
 */
const updateIsland = async (id, islandData) => {
  try {
    console.log('[updateIsland Repository] Starting update')
    console.log('[updateIsland Repository] Island ID:', id)
    console.log('[updateIsland Repository] Update data:', JSON.stringify(islandData, null, 2))
    
    const result = await pgCore('islands')
      .where('island_id', id)
      .where('is_delete', false)
      .update({
        ...islandData,
        updated_at: new Date().toISOString()
      })
      .returning('*')
    
    console.log('[updateIsland Repository] Update result:', JSON.stringify(result, null, 2))
    console.log('[updateIsland Repository] Result type:', typeof result)
    console.log('[updateIsland Repository] Is array:', Array.isArray(result))
    
    // Handle result - could be array or single object
    if (Array.isArray(result)) {
      const island = result.length > 0 ? result[0] : null
      console.log('[updateIsland Repository] Returning island:', island ? 'found' : 'null')
      return island
    }
    
    const island = result || null
    console.log('[updateIsland Repository] Returning island (non-array):', island ? 'found' : 'null')
    return island
  } catch (error) {
    console.error('[updateIsland Repository] Error in updateIsland:', error)
    console.error('[updateIsland Repository] Error code:', error.code)
    console.error('[updateIsland Repository] Error message:', error.message)
    console.error('[updateIsland Repository] Error detail:', error.detail)
    console.error('[updateIsland Repository] Error stack:', error.stack)
    throw error
  }
}

/**
 * Soft delete island
 */
const deleteIsland = async (id, deletedBy) => {
  try {
    const result = await pgCore('islands')
      .where('island_id', id)
      .update({
        is_delete: true,
        deleted_at: new Date().toISOString(),
        deleted_by: deletedBy
      })
      .returning('*')
    
    // Handle result - could be array or single object
      if (Array.isArray(result)) {
      return result.length > 0 ? result[0] : null
    }
    return result || null
  } catch (error) {
    console.error('Error in deleteIsland:', error)
    throw error
  }
}

module.exports = {
  getIslands,
  getIslandById,
  createIsland,
  updateIsland,
  deleteIsland
}

