const { pgCore } = require('../../config/database')
const { bankAccountsColumns } = require('./column')
const { applyStandardFilters, buildCountQuery, formatPaginatedResponse } = require('../../utils/query_builder')

/**
 * Get bank accounts with pagination and filtering menggunakan sistem filter standar
 */
const getBankAccounts = async (queryParams) => {
  // Base query untuk bank_accounts
  const baseQuery = pgCore('bank_accounts').select('*').where('bank_accounts.is_delete', false)
  
  // Apply semua filter standar
  const dataQuery = applyStandardFilters(baseQuery.clone(), queryParams)
  
  // Build count query untuk pagination metadata
  const countQuery = buildCountQuery(baseQuery, queryParams)
  
  // Execute queries secara parallel
  const [bankAccounts, countResult] = await Promise.all([
    dataQuery,
    countQuery.first()
  ])
  
  // Format response dengan pagination metadata
  return formatPaginatedResponse(bankAccounts, queryParams.pagination, countResult.total)
}

/**
 * Get bank account by ID
 */
const getBankAccountById = async (id) => {
  const [bankAccount] = await pgCore('bank_accounts')
    .select('*')
    .where('bank_account_id', id)
    .where('is_delete', false)
  
  return bankAccount
}

/**
 * Create new bank account
 */
const createBankAccount = async (bankAccountData) => {
  const [bankAccount] = await pgCore('bank_accounts')
    .insert(bankAccountData)
    .returning('*')
  
  return bankAccount
}

/**
 * Update bank account
 */
const updateBankAccount = async (id, bankAccountData) => {
  const [bankAccount] = await pgCore('bank_accounts')
    .where('bank_account_id', id)
    .update({
      ...bankAccountData,
      updated_at: new Date().toISOString()
    })
    .returning('*')
  
  return bankAccount
}

/**
 * Soft delete bank account
 */
const deleteBankAccount = async (id, deletedBy) => {
  const [bankAccount] = await pgCore('bank_accounts')
    .where('bank_account_id', id)
    .update({
      is_delete: true,
      deleted_at: new Date().toISOString(),
      deleted_by: deletedBy
    })
    .returning('*')
  
  return bankAccount
}

module.exports = {
  getBankAccounts,
  getBankAccountById,
  createBankAccount,
  updateBankAccount,
  deleteBankAccount
}

