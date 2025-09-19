const { departmentsColumns, departmentsValidationRules } = require('./column')
const { validateRequest } = require('../../utils/validation')
const { successResponse, errorResponse } = require('../../utils/response')
const { parseStandardQuery } = require('../../utils/pagination')
const departmentsRepository = require('./postgre_repository')
const databaseQueueService = require('../../services/database_queue_service')

class DepartmentsHandler {
  /**
   * Get all departments with pagination and filtering
   */
  async getDepartments(req, res) {
    try {
      // Support parameters from both query string (GET) and body (POST)
      const requestParams = {
        ...req.query,  // GET parameters
        ...req.body    // POST parameters
      }
      
      // Create a modified request object for parseStandardQuery
      const modifiedReq = {
        ...req,
        query: requestParams
      }

      // Parse query parameters menggunakan sistem filter standar
      const queryParams = parseStandardQuery(modifiedReq, {
        allowedSortColumns: ['department_name', 'company_id', 'department_parent_id', 'created_at', 'updated_at'],
        defaultSort: ['department_name', 'asc'],
        searchableColumns: ['department_name'],
        allowedFilters: ['department_name', 'company_id', 'company_name', 'department_parent_id', 'is_delete'],
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
  async getDepartmentById(req, res) {
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
  async createDepartment(req, res) {
    try {
      // Support parameters from both query string (GET) and body (POST)
      const requestParams = {
        ...req.query,  // GET parameters
        ...req.body    // POST parameters
      }

      // Validate request
      const validation = validateRequest(requestParams, departmentsValidationRules.create, departmentsColumns)
      if (!validation.isValid) {
        return errorResponse(res, validation.errors, 400)
      }

      const departmentData = {
        ...requestParams,
        created_by: req.user?.user_id
      }
      
      const department = await departmentsRepository.createDepartment(departmentData)
      
      // Kirim queue ke RabbitMQ untuk operasi CREATE
      await databaseQueueService.sendDepartmentsCreateQueue(departmentData, department)
      
      return successResponse(res, department, 'Department created successfully', 201)
    } catch (error) {
      console.error('Error creating department:', error)
      return errorResponse(res, 'Failed to create department', 500)
    }
  }

  /**
   * Update department
   */
  async updateDepartment(req, res) {
    try {
      const { id } = req.params
      
      const existingDepartment = await departmentsRepository.getDepartmentById(id)
      if (!existingDepartment) {
        return errorResponse(res, 'Department not found', 404)
      }

      // Validate request
      const validation = validateRequest(req.body, departmentsValidationRules.update, departmentsColumns)
      if (!validation.isValid) {
        return errorResponse(res, validation.errors, 400)
      }
      
      const updateData = {
        ...req.body,
        updated_by: req.user?.user_id,
        updated_at: new Date()
      }
      
      const department = await departmentsRepository.updateDepartment(id, updateData)
      
      // Kirim queue ke RabbitMQ untuk operasi UPDATE
      await databaseQueueService.sendDepartmentsUpdateQueue(id, updateData, department)
      
      return successResponse(res, department, 'Department updated successfully')
    } catch (error) {
      console.error('Error updating department:', error)
      return errorResponse(res, 'Failed to update department', 500)
    }
  }

  /**
   * Soft delete department
   */
  async deleteDepartment(req, res) {
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
      
      const result = await departmentsRepository.updateDepartment(id, deleteData)
      
      // Kirim queue ke RabbitMQ untuk operasi DELETE
      await databaseQueueService.sendDepartmentsDeleteQueue(id, deleteData, result)
      
      return successResponse(res, null, 'Department deleted successfully')
    } catch (error) {
      console.error('Error deleting department:', error)
      return errorResponse(res, 'Failed to delete department', 500)
    }
  }

  /**
   * Get departments by company
   */
  async getDepartmentsByCompany(req, res) {
    try {
      const { companyId } = req.params
      
      const departments = await departmentsRepository.getDepartmentsByCompanyId(companyId)
      
      return successResponse(res, departments, 'Departments retrieved successfully')
    } catch (error) {
      console.error('Error getting departments by company:', error)
      return errorResponse(res, 'Failed to retrieve departments', 500)
    }
  }
}

module.exports = new DepartmentsHandler()
