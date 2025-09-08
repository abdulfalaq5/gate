/**
 * Column definitions for companies table
 * Used for validation, documentation, and form generation
 */

const companiesColumns = {
  company_id: {
    type: 'uuid',
    primary: true,
    autoGenerate: true,
    description: 'Unique identifier for the company',
    example: '123e4567-e89b-12d3-a456-426614174000'
  },
  company_name: {
    type: 'string',
    required: true,
    maxLength: 100,
    minLength: 2,
    description: 'Company name',
    example: 'PT. Example Company'
  },
  company_parent_id: {
    type: 'uuid',
    required: false,
    description: 'Parent company ID for hierarchical structure',
    example: '123e4567-e89b-12d3-a456-426614174000'
  },
  company_address: {
    type: 'text',
    required: false,
    maxLength: 500,
    description: 'Company address',
    example: 'Jl. Example No. 123, Jakarta'
  },
  company_email: {
    type: 'string',
    required: false,
    maxLength: 100,
    format: 'email',
    description: 'Company email address',
    example: 'info@example.com'
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
const companiesIndexes = [
  {
    name: 'idx_companies_name',
    columns: ['company_name'],
    type: 'btree'
  },
  {
    name: 'idx_companies_parent_id',
    columns: ['company_parent_id'],
    type: 'btree'
  },
  {
    name: 'idx_companies_email',
    columns: ['company_email'],
    type: 'btree'
  },
  {
    name: 'idx_companies_is_delete',
    columns: ['is_delete'],
    type: 'btree'
  },
  {
    name: 'idx_companies_created_at',
    columns: ['created_at'],
    type: 'btree'
  }
]

// Validation rules for different operations
const companiesValidationRules = {
  create: {
    required: ['company_name'],
    optional: ['company_parent_id', 'company_address', 'company_email']
  },
  update: {
    required: [],
    optional: ['company_name', 'company_parent_id', 'company_address', 'company_email']
  },
  search: {
    fields: ['company_name', 'company_address', 'company_email']
  }
}

module.exports = {
  companiesColumns,
  companiesIndexes,
  companiesValidationRules
}
