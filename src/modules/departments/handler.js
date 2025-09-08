const { departmentsColumns, departmentsValidationRules } = require('./column')
const { validateRequest } = require('../../utils/validation')
const { successResponse, errorResponse } = require('../../utils/response')
const { parseStandardQuery } = require('../../utils/pagination')
const departmentsRepository = require('./postgre_repository')

/**
 * Get all departments with pagination and filtering
 */
const getDepartments = async (req, res) => {
  try {
    // Parse query parameters menggunakan sistem filter standar
    const queryParams = parseStandardQuery(req, {
      allowedSortColumns: ['department_name', 'company_id', 'department_parent_id', 'created_at', 'updated_at'],
      defaultSort: ['department_name', 'asc'],
      searchableColumns: ['department_name'],
      allowedFilters: ['company_id', 'department_parent_id', 'is_delete'],
      dateColumn: 'created_at'
    })
    
    const result = await departmentsRepository.getDepartments(queryParams)
    
    return successResponse(res, result, 'Departments retrieved successfully')
  } catch (error) {
    console.error('Error getting departments:', error)
    return errorResponse(res, 'Failed to retrieve departments', 500)
  }
}

/**
 * Get department by ID
 */
const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params
    
    const department = await departmentsRepository.getDepartmentById(id)
    if (!department) {
      return errorResponse(res, 'Department not found', 404)
    }
    
    return successResponse(res, department, 'Department retrieved successfully')
  } catch (error) {
    console.error('Error getting department:', error)
    return errorResponse(res, 'Failed to retrieve department', 500)
  }
}

/**
 * Create new department
 */
const createDepartment = async (req, res) => {
  try {
    const departmentData = {
      ...req.body,
      created_by: req.user?.user_id
    }
    
    const department = await departmentsRepository.createDepartment(departmentData)
    
    return successResponse(res, department, 'Department created successfully', 201)
  } catch (error) {
    console.error('Error creating department:', error)
    return errorResponse(res, 'Failed to create department', 500)
  }
}

/**
 * Update department
 */
const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params
    
    const existingDepartment = await departmentsRepository.getDepartmentById(id)
    if (!existingDepartment) {
      return errorResponse(res, 'Department not found', 404)
    }
    
    const updateData = {
      ...req.body,
      updated_by: req.user?.user_id,
      updated_at: new Date()
    }
    
    const department = await departmentsRepository.updateDepartment(id, updateData)
    
    return successResponse(res, department, 'Department updated successfully')
  } catch (error) {
    console.error('Error updating department:', error)
    return errorResponse(res, 'Failed to update department', 500)
  }
}

/**
 * Soft delete department
 */
const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params
    
    const existingDepartment = await departmentsRepository.getDepartmentById(id)
    if (!existingDepartment) {
      return errorResponse(res, 'Department not found', 404)
    }
    
    const deleteData = {
      is_delete: true,
      deleted_at: new Date(),
      deleted_by: req.user?.user_id
    }
    
    await departmentsRepository.updateDepartment(id, deleteData)
    
    return successResponse(res, null, 'Department deleted successfully')
  } catch (error) {
    console.error('Error deleting department:', error)
    return errorResponse(res, 'Failed to delete department', 500)
  }
}

/**
 * Get departments by company
 */
const getDepartmentsByCompany = async (req, res) => {
  try {
    const { companyId } = req.params
    
    const departments = await departmentsRepository.getDepartmentsByCompanyId(companyId)
    
    return successResponse(res, departments, 'Departments retrieved successfully')
  } catch (error) {
    console.error('Error getting departments by company:', error)
    return errorResponse(res, 'Failed to retrieve departments', 500)
  }
}

module.exports = {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentsByCompany
}
