const { pgCore } = require('../../config/database')
const { titlesColumns } = require('./column')

/**
 * Get titles with pagination and filtering
 */
const getTitles = async ({ page = 1, limit = 10, filters = {} }) => {
  const offset = (page - 1) * limit
  
  let query = pgCore('titles')
    .select('*')
    .where('is_delete', false)
  
  // Apply filters
  if (filters.search) {
    query = query.where(function() {
      this.where('title_name', 'ilike', `%${filters.search}%`)
    })
  }
  
  if (filters.department_id) {
    query = query.where('department_id', filters.department_id)
  }
  
  if (filters.is_delete !== undefined) {
    query = query.where('is_delete', filters.is_delete)
  }
  
  const [titles, totalCount] = await Promise.all([
    query.clone().offset(offset).limit(limit).orderBy('title_name'),
    query.clone().count('* as count').first()
  ])
  
  return {
    titles,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: parseInt(totalCount.count),
      totalPages: Math.ceil(totalCount.count / limit)
    }
  }
}

/**
 * Get title by ID
 */
const getTitleById = async (id) => {
  const [title] = await pgCore('titles')
    .select('*')
    .where('title_id', id)
    .where('is_delete', false)
  
  return title
}

/**
 * Create new title
 */
const createTitle = async (titleData) => {
  const [title] = await pgCore('titles')
    .insert(titleData)
    .returning('*')
  
  return title
}

/**
 * Update title
 */
const updateTitle = async (id, titleData) => {
  const [title] = await pgCore('titles')
    .where('title_id', id)
    .update({
      ...titleData,
      updated_at: new Date().toISOString()
    })
    .returning('*')
  
  return title
}

/**
 * Soft delete title
 */
const deleteTitle = async (id, deletedBy) => {
  const [title] = await pgCore('titles')
    .where('title_id', id)
    .update({
      is_delete: true,
      deleted_at: new Date().toISOString(),
      deleted_by: deletedBy
    })
    .returning('*')
  
  return title
}

/**
 * Get title by name
 */
const getTitleByName = async (name) => {
  const [title] = await pgCore('titles')
    .select('*')
    .where('title_name', name)
    .where('is_delete', false)
  
  return title
}

/**
 * Get titles by department ID
 */
const getTitlesByDepartmentId = async (departmentId) => {
  return await pgCore('titles')
    .select('*')
    .where('department_id', departmentId)
    .where('is_delete', false)
    .orderBy('title_name')
}

/**
 * Get titles statistics
 */
const getTitlesStats = async () => {
  const [stats] = await pgCore('titles')
    .count('* as total')
    .where('is_delete', false)
  
  return {
    total: parseInt(stats.total)
  }
}

module.exports = {
  getTitles,
  getTitleById,
  createTitle,
  updateTitle,
  deleteTitle,
  getTitleByName,
  getTitlesByDepartmentId,
  getTitlesStats
}