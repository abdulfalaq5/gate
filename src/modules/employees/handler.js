const { employeesColumns } = require('./column')
const { validateRequest } = require('../../utils/validation')
const { successResponse, errorResponse } = require('../../utils/response')
const { parseStandardQuery } = require('../../utils/pagination')
const { pgCore } = require('../../config/database')
const EmployeesRepository = require('./postgre_repository')

const employeesRepository = new EmployeesRepository(pgCore)

/**
 * Get all employees with pagination and filtering
 */
const getEmployees = async (req, res) => {
  try {
    // Parse query parameters menggunakan sistem filter standar
    const queryParams = parseStandardQuery(req, {
      allowedSortColumns: ['employee_name', 'employee_email', 'title_id', 'created_at', 'updated_at'],
      defaultSort: ['employee_name', 'asc'],
      searchableColumns: ['employee_name', 'employee_email'],
      allowedFilters: ['title_id', 'is_delete'],
      dateColumn: 'created_at'
    })
    
    const result = await employeesRepository.getEmployees(queryParams)
    
    return successResponse(res, result, 'Employees retrieved successfully')
  } catch (error) {
    console.error('Error getting employees:', error)
    return errorResponse(res, 'Failed to retrieve employees', 500)
  }
}

/**
 * Get employee by ID
 */
const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params
    
    const employee = await employeesRepository.getEmployeeById(id)
    if (!employee) {
      return errorResponse(res, 'Employee not found', 404)
    }
    
    return successResponse(res, employee, 'Employee retrieved successfully')
  } catch (error) {
    console.error('Error getting employee:', error)
    return errorResponse(res, 'Failed to retrieve employee', 500)
  }
}

/**
 * Create new employee
 */
const createEmployee = async (req, res) => {
  try {
    const employeeData = {
      ...req.body,
      created_by: req.user?.user_id
    }
    
    const employee = await employeesRepository.createEmployee(employeeData)
    
    return successResponse(res, employee, 'Employee created successfully', 201)
  } catch (error) {
    console.error('Error creating employee:', error)
    return errorResponse(res, 'Failed to create employee', 500)
  }
}

/**
 * Update employee
 */
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params
    
    const existingEmployee = await employeesRepository.getEmployeeById(id)
    if (!existingEmployee) {
      return errorResponse(res, 'Employee not found', 404)
    }
    
    const updateData = {
      ...req.body,
      updated_by: req.user?.user_id,
      updated_at: new Date()
    }
    
    const employee = await employeesRepository.updateEmployee(id, updateData)
    
    return successResponse(res, employee, 'Employee updated successfully')
  } catch (error) {
    console.error('Error updating employee:', error)
    return errorResponse(res, 'Failed to update employee', 500)
  }
}

/**
 * Soft delete employee
 */
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params
    
    const existingEmployee = await employeesRepository.getEmployeeById(id)
    if (!existingEmployee) {
      return errorResponse(res, 'Employee not found', 404)
    }
    
    const deleteData = {
      is_delete: true,
      deleted_at: new Date(),
      deleted_by: req.user?.user_id
    }
    
    await employeesRepository.updateEmployee(id, deleteData)
    
    return successResponse(res, null, 'Employee deleted successfully')
  } catch (error) {
    console.error('Error deleting employee:', error)
    return errorResponse(res, 'Failed to delete employee', 500)
  }
}

/**
 * Get employees by title
 */
const getEmployeesByTitle = async (req, res) => {
  try {
    const { titleId } = req.params
    
    const employees = await employeesRepository.getEmployeesByTitleId(titleId)
    
    return successResponse(res, employees, 'Employees retrieved successfully')
  } catch (error) {
    console.error('Error getting employees by title:', error)
    return errorResponse(res, 'Failed to retrieve employees', 500)
  }
}

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeesByTitle
}
