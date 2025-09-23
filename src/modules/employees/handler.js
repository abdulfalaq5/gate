const { employeesColumns, employeesValidationRules } = require('./column')
const { validateRequest } = require('../../utils/validation')
const { successResponse, errorResponse } = require('../../utils/response')
const { parseStandardQuery } = require('../../utils/pagination')
const { pgCore } = require('../../config/database')
const EmployeesRepository = require('./postgre_repository')
const databaseQueueService = require('../../services/database_queue_service')
const bcrypt = require('bcrypt')

const employeesRepository = new EmployeesRepository(pgCore)

/**
 * Get all employees with pagination and filtering (POST method for complex queries)
 */
const getEmployees = async (req, res) => {
  try {
    // Support parameters from both query string (GET) and body (POST)
    const requestParams = {
      ...req.query,  // GET parameters
      ...req.body    // POST parameters
    };
    
    // Create a modified request object for parseStandardQuery
    const modifiedReq = {
      ...req,
      query: requestParams
    };

    // Parse query parameters menggunakan sistem filter standar
    const queryParams = parseStandardQuery(modifiedReq, {
      allowedSortColumns: ['employee_name', 'employee_email', 'title_id', 'created_at', 'updated_at'],
      defaultSort: ['created_at', 'desc'],
      searchableColumns: ['employee_name', 'employee_email', 'title_name', 'department_name', 'company_name'],
      allowedFilters: ['title_id', 'is_delete', 'company_name', 'department_name', 'title_name'],
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
    // Validate request
    const validation = validateRequest(req.body, employeesValidationRules.create, employeesColumns)
    if (!validation.isValid) {
      return errorResponse(res, validation.errors, 400)
    }

    // Prepare employee data - exclude company_id and employeeHasPermissions as they're not direct columns in employees table
    const { company_id, employeeHasPermissions, ...employeePayload } = req.body
    
    // Hash password if provided
    if (employeePayload.password) {
      employeePayload.password = await bcrypt.hash(employeePayload.password, 10)
    }
    
    const employeeData = {
      ...employeePayload,
      created_by: req.user?.user_id
    }
    
    const employee = await employeesRepository.createEmployee(employeeData)
    
    // Create employee permissions if provided
    if (employeeHasPermissions && Array.isArray(employeeHasPermissions)) {
      await employeesRepository.createEmployeePermissions(
        employee.employee_id, 
        employeeHasPermissions, 
        req.user?.user_id
      )
    }
    
    // Kirim queue ke RabbitMQ untuk operasi CREATE
    await databaseQueueService.sendEmployeesCreateQueue(employeeData, employee)
    
    // Ambil data employee lengkap dengan relasi setelah dibuat
    const employeeWithRelations = await employeesRepository.getEmployeeById(employee.employee_id)
    
    return successResponse(res, employeeWithRelations, 'Employee created successfully', 201)
  } catch (error) {
    console.error('Error creating employee:', error)
    
    // Provide more specific error message
    if (error.code === '23503') { // Foreign key constraint violation
      return errorResponse(res, 'Invalid title_id, department_id, menu_id, or permission_id. One or more referenced records do not exist.', 400)
    }
    if (error.code === '23505') { // Unique constraint violation
      return errorResponse(res, 'Employee with this email already exists.', 400)
    }
    
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
    
    // Prepare update data - exclude company_id and employeeHasPermissions as they're not direct columns in employees table
    const { company_id, employeeHasPermissions, ...updatePayload } = req.body
    
    // Hash password if provided
    if (updatePayload.password) {
      updatePayload.password = await bcrypt.hash(updatePayload.password, 10)
    }
    
    const updateData = {
      ...updatePayload,
      updated_by: req.user?.user_id,
      updated_at: new Date()
    }
    
    const result = await employeesRepository.updateEmployee(id, updateData)
    
    // Update employee permissions if provided
    if (employeeHasPermissions && Array.isArray(employeeHasPermissions)) {
      // Delete existing permissions first
      await employeesRepository.deleteEmployeePermissions(id)
      
      // Create new permissions
      await employeesRepository.createEmployeePermissions(
        id, 
        employeeHasPermissions, 
        req.user?.user_id
      )
    }
    
    // Kirim queue ke RabbitMQ untuk operasi UPDATE
    await databaseQueueService.sendEmployeesUpdateQueue(id, updateData, result)
    
    // Ambil data employee lengkap dengan relasi setelah diupdate
    const employeeWithRelations = await employeesRepository.getEmployeeById(id)
    
    return successResponse(res, employeeWithRelations, 'Employee updated successfully')
  } catch (error) {
    console.error('Error updating employee:', error)
    
    // Provide more specific error message
    if (error.code === '23503') { // Foreign key constraint violation
      return errorResponse(res, 'Invalid title_id, department_id, gender_id, island_id, menu_id, or permission_id. One or more referenced records do not exist.', 400)
    }
    if (error.code === '23505') { // Unique constraint violation
      return errorResponse(res, 'Employee with this email already exists.', 400)
    }
    
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
    
    const result = await employeesRepository.updateEmployee(id, deleteData)
    
    // Kirim queue ke RabbitMQ untuk operasi DELETE
    await databaseQueueService.sendEmployeesDeleteQueue(id, deleteData, result)
    
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
