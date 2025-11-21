const { pgCore } = require('../../config/database')
const { applyStandardFilters, buildCountQuery, formatSimplePaginatedResponse } = require('../../utils/query_builder')

/**
 * Get on board documents with pagination and filtering menggunakan sistem filter standar
 */
const getOnBoardDocuments = async (queryParams) => {
  // Base query untuk on_board_documents
  const baseQuery = pgCore('on_board_documents')
    .select('on_board_documents.*')
    .where('on_board_documents.is_delete', false)
  
  // Handle candidate_id filter khusus: ignore jika empty string, null, atau 'nan'
  const filters = { ...queryParams.filters }
  
  if (filters.candidate_id !== undefined) {
    // Check if candidate_id is empty string, null, 'null', 'nan', or 'NaN'
    if (filters.candidate_id === '' || 
        filters.candidate_id === null || 
        filters.candidate_id === 'null' || 
        filters.candidate_id === 'nan' || 
        filters.candidate_id === 'NaN') {
      delete filters.candidate_id
    }
  }
  
  // Apply semua filter standar dengan filters yang sudah dihandle
  const modifiedQueryParams = {
    ...queryParams,
    filters
  }
  
  const dataQuery = applyStandardFilters(baseQuery.clone(), modifiedQueryParams)
  
  // Build count query untuk pagination metadata
  const countQuery = buildCountQuery(baseQuery, modifiedQueryParams)
  
  // Execute queries secara parallel
  const [onBoardDocuments, countResult] = await Promise.all([
    dataQuery,
    countQuery.first()
  ])
  
  // Load candidate relation for each on board document
  const onBoardDocumentsWithRelations = await Promise.all(
    onBoardDocuments.map(async (onBoardDocument) => {
      if (onBoardDocument.candidate_id) {
        try {
          const candidate = await pgCore('candidates')
            .select('candidates.*')
            .where('candidates.candidate_id', onBoardDocument.candidate_id)
            .where('candidates.is_delete', false)
            .first()
          
          if (candidate) {
            onBoardDocument.candidate = candidate
          }
        } catch (error) {
          console.error('Error loading candidate for on board document:', error)
        }
      }
      return onBoardDocument
    })
  )
  
  // Format response dengan pagination metadata
  return formatSimplePaginatedResponse(onBoardDocumentsWithRelations, queryParams.pagination, countResult.total)
}

/**
 * Get on board document by ID with all relations
 */
const getOnBoardDocumentById = async (id) => {
  const onBoardDocument = await pgCore('on_board_documents')
    .select('on_board_documents.*')
    .where('on_board_documents.on_board_document_id', id)
    .where('on_board_documents.is_delete', false)
    .first()
  
  if (!onBoardDocument) {
    return null
  }
  
  // Get candidate relation if exists
  if (onBoardDocument.candidate_id) {
    try {
      const candidate = await pgCore('candidates')
        .select('candidates.*')
        .where('candidates.candidate_id', onBoardDocument.candidate_id)
        .where('candidates.is_delete', false)
        .first()
      
      if (candidate) {
        onBoardDocument.candidate = candidate
      }
    } catch (error) {
      console.error('Error loading candidate for on board document:', error)
    }
  }
  
  return onBoardDocument
}

/**
 * Create new on board document
 */
const createOnBoardDocument = async (onBoardDocumentData, userId) => {
  const trx = await pgCore.transaction()
  
  try {
    // Insert on board document
    const [onBoardDocument] = await trx('on_board_documents')
      .insert({
        ...onBoardDocumentData,
        created_by: userId,
        updated_by: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .returning('*')
    
    await trx.commit()
    
    // Get full on board document with relations
    return await getOnBoardDocumentById(onBoardDocument.on_board_document_id)
  } catch (error) {
    await trx.rollback()
    throw error
  }
}

/**
 * Update on board document
 */
const updateOnBoardDocument = async (id, onBoardDocumentData, userId) => {
  const trx = await pgCore.transaction()
  
  try {
    // Get existing on board document
    const existingOnBoardDocument = await trx('on_board_documents')
      .where('on_board_document_id', id)
      .where('is_delete', false)
      .first()
    
    if (!existingOnBoardDocument) {
      throw new Error('On board document not found')
    }
    
    // Update on board document
    const [onBoardDocument] = await trx('on_board_documents')
      .where('on_board_document_id', id)
      .where('is_delete', false)
      .update({
        ...onBoardDocumentData,
        updated_by: userId,
        updated_at: new Date().toISOString()
      })
      .returning('*')
    
    await trx.commit()
    
    // Get full on board document with relations
    return await getOnBoardDocumentById(id)
  } catch (error) {
    await trx.rollback()
    throw error
  }
}

/**
 * Soft delete on board document
 */
const deleteOnBoardDocument = async (id, userId) => {
  const [onBoardDocument] = await pgCore('on_board_documents')
    .where('on_board_document_id', id)
    .where('is_delete', false)
    .update({
      is_delete: true,
      deleted_at: new Date().toISOString(),
      deleted_by: userId,
      updated_at: new Date().toISOString()
    })
    .returning('*')
  
  return onBoardDocument
}

module.exports = {
  getOnBoardDocuments,
  getOnBoardDocumentById,
  createOnBoardDocument,
  updateOnBoardDocument,
  deleteOnBoardDocument
}

