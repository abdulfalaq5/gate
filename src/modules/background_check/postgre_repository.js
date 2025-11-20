const { pgCore } = require('../../config/database')
const { applyStandardFilters, buildCountQuery, formatSimplePaginatedResponse } = require('../../utils/query_builder')

/**
 * Get background checks with pagination and filtering menggunakan sistem filter standar
 */
const getBackgroundChecks = async (queryParams) => {
  // Base query untuk background_checks
  const baseQuery = pgCore('background_checks')
    .select('background_checks.*')
    .where('background_checks.is_delete', false)
  
  // Apply semua filter standar
  const dataQuery = applyStandardFilters(baseQuery.clone(), queryParams)
  
  // Build count query untuk pagination metadata
  const countQuery = buildCountQuery(baseQuery, queryParams)
  
  // Execute queries secara parallel
  const [backgroundChecks, countResult] = await Promise.all([
    dataQuery,
    countQuery.first()
  ])
  
  // Load candidate relation for each background check
  const backgroundChecksWithRelations = await Promise.all(
    backgroundChecks.map(async (backgroundCheck) => {
      if (backgroundCheck.candidate_id) {
        try {
          const candidate = await pgCore('candidates')
            .select('candidates.*')
            .where('candidates.candidate_id', backgroundCheck.candidate_id)
            .where('candidates.is_delete', false)
            .first()
          
          if (candidate) {
            backgroundCheck.candidate = candidate
          }
        } catch (error) {
          console.error('Error loading candidate for background check:', error)
        }
      }
      return backgroundCheck
    })
  )
  
  // Format response dengan pagination metadata
  return formatSimplePaginatedResponse(backgroundChecksWithRelations, queryParams.pagination, countResult.total)
}

/**
 * Get background check by ID with all relations
 */
const getBackgroundCheckById = async (id) => {
  const backgroundCheck = await pgCore('background_checks')
    .select('background_checks.*')
    .where('background_checks.background_check_id', id)
    .where('background_checks.is_delete', false)
    .first()
  
  if (!backgroundCheck) {
    return null
  }
  
  // Get candidate relation if exists
  if (backgroundCheck.candidate_id) {
    try {
      const candidate = await pgCore('candidates')
        .select('candidates.*')
        .where('candidates.candidate_id', backgroundCheck.candidate_id)
        .where('candidates.is_delete', false)
        .first()
      
      if (candidate) {
        backgroundCheck.candidate = candidate
      }
    } catch (error) {
      console.error('Error loading candidate for background check:', error)
    }
  }
  
  return backgroundCheck
}

/**
 * Create new background check
 */
const createBackgroundCheck = async (backgroundCheckData, userId) => {
  const trx = await pgCore.transaction()
  
  try {
    // Insert background check
    const [backgroundCheck] = await trx('background_checks')
      .insert({
        ...backgroundCheckData,
        created_by: userId,
        updated_by: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .returning('*')
    
    // Update candidate_status if background_status is set
    if (backgroundCheck.candidate_id && backgroundCheck.background_status) {
      let candidateStatus = null
      
      if (backgroundCheck.background_status === 'hired') {
        candidateStatus = 'hired'
      } else if (backgroundCheck.background_status === 'rejected') {
        candidateStatus = 'rejected'
      } else if (backgroundCheck.background_status === 'hold') {
        candidateStatus = 'hold'
      }
      
      if (candidateStatus) {
        await trx('candidates')
          .where('candidate_id', backgroundCheck.candidate_id)
          .where('is_delete', false)
          .update({
            candidate_status: candidateStatus,
            updated_at: new Date().toISOString()
          })
      }
    }
    
    await trx.commit()
    
    // Get full background check with relations
    return await getBackgroundCheckById(backgroundCheck.background_check_id)
  } catch (error) {
    await trx.rollback()
    throw error
  }
}

/**
 * Update background check
 */
const updateBackgroundCheck = async (id, backgroundCheckData, userId) => {
  const trx = await pgCore.transaction()
  
  try {
    // Get existing background check
    const existingBackgroundCheck = await trx('background_checks')
      .where('background_check_id', id)
      .where('is_delete', false)
      .first()
    
    if (!existingBackgroundCheck) {
      throw new Error('Background check not found')
    }
    
    // Update background check
    const [backgroundCheck] = await trx('background_checks')
      .where('background_check_id', id)
      .where('is_delete', false)
      .update({
        ...backgroundCheckData,
        updated_by: userId,
        updated_at: new Date().toISOString()
      })
      .returning('*')
    
    // Update candidate_status if background_status is set
    if (backgroundCheck.candidate_id && backgroundCheck.background_status) {
      let candidateStatus = null
      
      if (backgroundCheck.background_status === 'hired') {
        candidateStatus = 'hired'
      } else if (backgroundCheck.background_status === 'rejected') {
        candidateStatus = 'rejected'
      } else if (backgroundCheck.background_status === 'hold') {
        candidateStatus = 'hold'
      }
      
      if (candidateStatus) {
        await trx('candidates')
          .where('candidate_id', backgroundCheck.candidate_id)
          .where('is_delete', false)
          .update({
            candidate_status: candidateStatus,
            updated_at: new Date().toISOString()
          })
      }
    }
    
    await trx.commit()
    
    // Get full background check with relations
    return await getBackgroundCheckById(id)
  } catch (error) {
    await trx.rollback()
    throw error
  }
}

/**
 * Soft delete background check
 */
const deleteBackgroundCheck = async (id, userId) => {
  const [backgroundCheck] = await pgCore('background_checks')
    .where('background_check_id', id)
    .where('is_delete', false)
    .update({
      is_delete: true,
      deleted_at: new Date().toISOString(),
      deleted_by: userId,
      updated_at: new Date().toISOString()
    })
    .returning('*')
  
  return backgroundCheck
}

module.exports = {
  getBackgroundChecks,
  getBackgroundCheckById,
  createBackgroundCheck,
  updateBackgroundCheck,
  deleteBackgroundCheck
}

