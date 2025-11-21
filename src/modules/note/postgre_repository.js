const { pgCore } = require('../../config/database')
const { applyStandardFilters, buildCountQuery, formatSimplePaginatedResponse } = require('../../utils/query_builder')

/**
 * Get notes with pagination and filtering menggunakan sistem filter standar
 */
const getNotes = async (queryParams) => {
  // Base query untuk notes
  const baseQuery = pgCore('notes')
    .select('notes.*')
    .where('notes.is_delete', false)
  
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
  const [notes, countResult] = await Promise.all([
    dataQuery,
    countQuery.first()
  ])
  
  // Load candidate relation for each note
  const notesWithRelations = await Promise.all(
    notes.map(async (note) => {
      if (note.candidate_id) {
        try {
          const candidate = await pgCore('candidates')
            .select('candidates.*')
            .where('candidates.candidate_id', note.candidate_id)
            .where('candidates.is_delete', false)
            .first()
          
          if (candidate) {
            note.candidate = candidate
          }
        } catch (error) {
          console.error('Error loading candidate for note:', error)
        }
      }
      
      // Load employee relation if exists
      if (note.employee_id) {
        try {
          const employee = await pgCore('employees')
            .select('employees.*')
            .where('employees.employee_id', note.employee_id)
            .where('employees.is_delete', false)
            .first()
          
          if (employee) {
            note.employee = employee
          }
        } catch (error) {
          console.error('Error loading employee for note:', error)
        }
      }
      
      return note
    })
  )
  
  // Format response dengan pagination metadata
  return formatSimplePaginatedResponse(notesWithRelations, queryParams.pagination, countResult.total)
}

/**
 * Get note by ID with all relations
 */
const getNoteById = async (id) => {
  const note = await pgCore('notes')
    .select('notes.*')
    .where('notes.note_id', id)
    .where('notes.is_delete', false)
    .first()
  
  if (!note) {
    return null
  }
  
  // Get candidate relation if exists
  if (note.candidate_id) {
    try {
      const candidate = await pgCore('candidates')
        .select('candidates.*')
        .where('candidates.candidate_id', note.candidate_id)
        .where('candidates.is_delete', false)
        .first()
      
      if (candidate) {
        note.candidate = candidate
      }
    } catch (error) {
      console.error('Error loading candidate for note:', error)
    }
  }
  
  // Get employee relation if exists
  if (note.employee_id) {
    try {
      const employee = await pgCore('employees')
        .select('employees.*')
        .where('employees.employee_id', note.employee_id)
        .where('employees.is_delete', false)
        .first()
      
      if (employee) {
        note.employee = employee
      }
    } catch (error) {
      console.error('Error loading employee for note:', error)
    }
  }
  
  return note
}

/**
 * Create new note
 */
const createNote = async (noteData, userId) => {
  const trx = await pgCore.transaction()
  
  try {
    // Insert note with employee_id from token
    const [note] = await trx('notes')
      .insert({
        ...noteData,
        employee_id: userId, // Set employee_id from token
        created_by: userId,
        updated_by: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .returning('*')
    
    await trx.commit()
    
    // Get full note with relations
    return await getNoteById(note.note_id)
  } catch (error) {
    await trx.rollback()
    throw error
  }
}

/**
 * Update note
 */
const updateNote = async (id, noteData, userId) => {
  const trx = await pgCore.transaction()
  
  try {
    // Get existing note
    const existingNote = await trx('notes')
      .where('note_id', id)
      .where('is_delete', false)
      .first()
    
    if (!existingNote) {
      throw new Error('Note not found')
    }
    
    // Update note
    const [note] = await trx('notes')
      .where('note_id', id)
      .where('is_delete', false)
      .update({
        ...noteData,
        updated_by: userId,
        updated_at: new Date().toISOString()
      })
      .returning('*')
    
    await trx.commit()
    
    // Get full note with relations
    return await getNoteById(id)
  } catch (error) {
    await trx.rollback()
    throw error
  }
}

/**
 * Soft delete note
 */
const deleteNote = async (id, userId) => {
  const [note] = await pgCore('notes')
    .where('note_id', id)
    .where('is_delete', false)
    .update({
      is_delete: true,
      deleted_at: new Date().toISOString(),
      deleted_by: userId,
      updated_at: new Date().toISOString()
    })
    .returning('*')
  
  return note
}

module.exports = {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
}

