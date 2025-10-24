/**
 * Column definitions for bank_accounts table
 * Used for validation, documentation, and form generation
 */

const bankAccountsColumns = {
  bank_account_id: {
    type: 'uuid',
    primary: true,
    autoGenerate: true,
    description: 'Unique identifier for the bank account',
    example: '123e4567-e89b-12d3-a456-426614174000'
  },
  bank_account_name: {
    type: 'string',
    required: false,
    maxLength: 255,
    description: 'Bank account name',
    example: 'BCA KCP Sudirman'
  },
  bank_account_number: {
    type: 'string',
    required: false,
    maxLength: 255,
    description: 'Bank account number',
    example: '1234567890'
  },
  bank_account_type: {
    type: 'string',
    required: false,
    maxLength: 255,
    description: 'Bank account type',
    example: 'Savings'
  },
  bank_account_balance: {
    type: 'decimal',
    required: false,
    precision: 10,
    scale: 2,
    description: 'Bank account balance',
    example: 1000000.00
  },
  created_at: {
    type: 'timestamp',
    required: false,
    autoGenerate: true,
    description: 'Record creation timestamp',
    example: '2023-01-01T00:00:00Z'
  },
  updated_at: {
    type: 'timestamp',
    required: false,
    autoGenerate: true,
    description: 'Record last update timestamp',
    example: '2023-01-01T00:00:00Z'
  },
  created_by: {
    type: 'uuid',
    required: false,
    description: 'User ID who created the record',
    example: '123e4567-e89b-12d3-a456-426614174000'
  },
  updated_by: {
    type: 'uuid',
    required: false,
    description: 'User ID who last updated the record',
    example: '123e4567-e89b-12d3-a456-426614174000'
  },
  deleted_at: {
    type: 'timestamp',
    required: false,
    description: 'Record deletion timestamp',
    example: '2023-01-01T00:00:00Z'
  },
  deleted_by: {
    type: 'uuid',
    required: false,
    description: 'User ID who deleted the record',
    example: '123e4567-e89b-12d3-a456-426614174000'
  },
  is_delete: {
    type: 'boolean',
    required: false,
    defaultValue: false,
    description: 'Soft delete flag',
    example: false
  }
}

// Index definitions
const bankAccountsIndexes = [
  {
    name: 'idx_bank_accounts_name',
    columns: ['bank_account_name'],
    type: 'btree'
  },
  {
    name: 'idx_bank_accounts_number',
    columns: ['bank_account_number'],
    type: 'btree'
  },
  {
    name: 'idx_bank_accounts_type',
    columns: ['bank_account_type'],
    type: 'btree'
  },
  {
    name: 'idx_bank_accounts_is_delete',
    columns: ['is_delete'],
    type: 'btree'
  },
  {
    name: 'idx_bank_accounts_created_at',
    columns: ['created_at'],
    type: 'btree'
  }
]

// Validation rules for different operations
const bankAccountsValidationRules = {
  create: {
    required: [],
    optional: ['bank_account_name', 'bank_account_number', 'bank_account_type', 'bank_account_balance']
  },
  update: {
    required: [],
    optional: ['bank_account_name', 'bank_account_number', 'bank_account_type', 'bank_account_balance']
  },
  search: {
    fields: ['bank_account_name', 'bank_account_number', 'bank_account_type']
  }
}

module.exports = {
  bankAccountsColumns,
  bankAccountsIndexes,
  bankAccountsValidationRules
}

