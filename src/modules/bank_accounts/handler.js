const { bankAccountsColumns, bankAccountsValidationRules } = require('./column')
const { validateRequest } = require('../../utils/validation')
const { successResponse, errorResponse } = require('../../utils/response')
const { parseStandardQuery } = require('../../utils/pagination')
const bankAccountsRepository = require('./postgre_repository')

class BankAccountsHandler {
  /**
   * Get all bank accounts with pagination and filtering
   */
  async getBankAccounts(req, res) {
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
        allowedSortColumns: ['bank_account_name', 'bank_account_number', 'bank_account_type', 'bank_account_balance', 'created_at', 'updated_at'],
        defaultSort: ['created_at', 'desc'],
        searchableColumns: ['bank_account_name', 'bank_account_number', 'bank_account_type'],
        allowedFilters: ['bank_account_name', 'bank_account_number', 'bank_account_type', 'is_delete'],
        dateColumn: 'created_at'
      })
      
      const result = await bankAccountsRepository.getBankAccounts(queryParams)
      
      return successResponse(res, result, 'Bank accounts retrieved successfully')
    } catch (error) {
      console.error('Error getting bank accounts:', error)
      return errorResponse(res, 'Failed to retrieve bank accounts', 500)
    }
  }

  /**
   * Get bank account by ID
   */
  async getBankAccountById(req, res) {
    try {
      const { id } = req.params
      
      const bankAccount = await bankAccountsRepository.getBankAccountById(id)
      if (!bankAccount) {
        return errorResponse(res, 'Bank account not found', 404)
      }
      
      return successResponse(res, bankAccount, 'Bank account retrieved successfully')
    } catch (error) {
      console.error('Error getting bank account:', error)
      return errorResponse(res, 'Failed to retrieve bank account', 500)
    }
  }

  /**
   * Create new bank account
   */
  async createBankAccount(req, res) {
    try {
      // Support parameters from both query string (GET) and body (POST)
      const requestParams = {
        ...req.query,  // GET parameters
        ...req.body    // POST parameters
      }

      // Validate request
      const validation = validateRequest(requestParams, bankAccountsValidationRules.create, bankAccountsColumns)
      if (!validation.isValid) {
        return errorResponse(res, validation.errors, 400)
      }
      
      const bankAccountData = {
        ...requestParams,
        created_by: req.user?.user_id || req.user?.employee_id
      }
      
      const bankAccount = await bankAccountsRepository.createBankAccount(bankAccountData)
      
      return successResponse(res, bankAccount, 'Bank account created successfully', 201)
    } catch (error) {
      console.error('Error creating bank account:', error)
      return errorResponse(res, 'Failed to create bank account', 500)
    }
  }

  /**
   * Update bank account
   */
  async updateBankAccount(req, res) {
    try {
      const { id } = req.params
      
      // Check if bank account exists
      const existingBankAccount = await bankAccountsRepository.getBankAccountById(id)
      if (!existingBankAccount) {
        return errorResponse(res, 'Bank account not found', 404)
      }
      
      // Validate request
      const validation = validateRequest(req.body, bankAccountsValidationRules.update, bankAccountsColumns)
      if (!validation.isValid) {
        return errorResponse(res, validation.errors, 400)
      }
      
      const updateData = {
        ...req.body,
        updated_by: req.user?.user_id || req.user?.employee_id,
        updated_at: new Date()
      }
      
      const bankAccount = await bankAccountsRepository.updateBankAccount(id, updateData)
      
      return successResponse(res, bankAccount, 'Bank account updated successfully')
    } catch (error) {
      console.error('Error updating bank account:', error)
      return errorResponse(res, 'Failed to update bank account', 500)
    }
  }

  /**
   * Soft delete bank account
   */
  async deleteBankAccount(req, res) {
    try {
      const { id } = req.params
      
      // Check if bank account exists
      const existingBankAccount = await bankAccountsRepository.getBankAccountById(id)
      if (!existingBankAccount) {
        return errorResponse(res, 'Bank account not found', 404)
      }
      
      const deleteData = {
        is_delete: true,
        deleted_at: new Date(),
        deleted_by: req.user?.user_id || req.user?.employee_id
      }
      
      const result = await bankAccountsRepository.updateBankAccount(id, deleteData)
      
      return successResponse(res, null, 'Bank account deleted successfully')
    } catch (error) {
      console.error('Error deleting bank account:', error)
      return errorResponse(res, 'Failed to delete bank account', 500)
    }
  }
}

module.exports = new BankAccountsHandler()

