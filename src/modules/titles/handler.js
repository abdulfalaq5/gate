const { titlesColumns } = require('./column')
const { successResponse, errorResponse } = require('../../utils/response')
const titlesRepository = require('./postgre_repository')

/**
 * Get all titles with pagination and filtering
 */
const getTitles = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, department_id, is_delete = false } = req.query
    
    const filters = {
      search,
      department_id,
      is_delete: is_delete === 'true'
    }
    
    const result = await titlesRepository.getTitles({
      page: parseInt(page),
      limit: parseInt(limit),
      filters
    })
    
    return successResponse(res, result, 'Titles retrieved successfully')
  } catch (error) {
    console.error('Error getting titles:', error)
    return errorResponse(res, 'Failed to retrieve titles', 500)
  }
}

/**
 * Get title by ID
 */
const getTitleById = async (req, res) => {
  try {
    const { id } = req.params
    
    const title = await titlesRepository.getTitleById(id)
    if (!title) {
      return errorResponse(res, 'Title not found', 404)
    }
    
    return successResponse(res, title, 'Title retrieved successfully')
  } catch (error) {
    console.error('Error getting title:', error)
    return errorResponse(res, 'Failed to retrieve title', 500)
  }
}

/**
 * Create new title
 */
const createTitle = async (req, res) => {
  try {
    const titleData = {
      ...req.body,
      created_by: req.user?.user_id
    }
    
    const title = await titlesRepository.createTitle(titleData)
    
    return successResponse(res, title, 'Title created successfully', 201)
  } catch (error) {
    console.error('Error creating title:', error)
    return errorResponse(res, 'Failed to create title', 500)
  }
}

/**
 * Update title
 */
const updateTitle = async (req, res) => {
  try {
    const { id } = req.params
    
    const existingTitle = await titlesRepository.getTitleById(id)
    if (!existingTitle) {
      return errorResponse(res, 'Title not found', 404)
    }
    
    const updateData = {
      ...req.body,
      updated_by: req.user?.user_id,
      updated_at: new Date()
    }
    
    const title = await titlesRepository.updateTitle(id, updateData)
    
    return successResponse(res, title, 'Title updated successfully')
  } catch (error) {
    console.error('Error updating title:', error)
    return errorResponse(res, 'Failed to update title', 500)
  }
}

/**
 * Soft delete title
 */
const deleteTitle = async (req, res) => {
  try {
    const { id } = req.params
    
    const existingTitle = await titlesRepository.getTitleById(id)
    if (!existingTitle) {
      return errorResponse(res, 'Title not found', 404)
    }
    
    const deleteData = {
      is_delete: true,
      deleted_at: new Date(),
      deleted_by: req.user?.user_id
    }
    
    await titlesRepository.updateTitle(id, deleteData)
    
    return successResponse(res, null, 'Title deleted successfully')
  } catch (error) {
    console.error('Error deleting title:', error)
    return errorResponse(res, 'Failed to delete title', 500)
  }
}

/**
 * Get titles by department
 */
const getTitlesByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params
    
    const titles = await titlesRepository.getTitlesByDepartmentId(departmentId)
    
    return successResponse(res, titles, 'Titles retrieved successfully')
  } catch (error) {
    console.error('Error getting titles by department:', error)
    return errorResponse(res, 'Failed to retrieve titles', 500)
  }
}

module.exports = {
  getTitles,
  getTitleById,
  createTitle,
  updateTitle,
  deleteTitle,
  getTitlesByDepartment
}
