/**
 * Column definitions for customers table
 * Used for validation, documentation, and form generation
 */

const customersColumns = {
  customer_id: {
    type: 'uuid',
    primary: true,
    autoGenerate: true,
    description: 'Unique identifier for the customer',
    example: '123e4567-e89b-12d3-a456-426614174000'
  },
  customer_name: {
    type: 'string',
    required: false,
    maxLength: 255,
    description: 'Customer name',
    example: 'John Doe'
  },
  customer_email: {
    type: 'string',
    required: false,
    maxLength: 255,
    format: 'email',
    description: 'Customer email address',
    example: 'john.doe@example.com'
  },
  customer_phone: {
    type: 'string',
    required: false,
    maxLength: 255,
    description: 'Customer phone number',
    example: '+6281234567890'
  },
  job_title: {
    type: 'string',
    required: false,
    maxLength: 255,
    description: 'Customer job title or position',
    example: 'Marketing Manager'
  },
  customer_address: {
    type: 'text',
    required: false,
    description: 'Customer address',
    example: 'Jl. Sudirman No. 123, Jakarta Selatan'
  },
  customer_city: {
    type: 'string',
    required: false,
    maxLength: 255,
    description: 'Customer city',
    example: 'Jakarta'
  },
  customer_state: {
    type: 'string',
    required: false,
    maxLength: 255,
    description: 'Customer state/province',
    example: 'DKI Jakarta'
  },
  customer_zip: {
    type: 'string',
    required: false,
    maxLength: 255,
    description: 'Customer postal code',
    example: '12190'
  },
  customer_country: {
    type: 'string',
    required: false,
    maxLength: 255,
    description: 'Customer country',
    example: 'Indonesia'
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
const customersIndexes = [
  {
    name: 'idx_customers_name',
    columns: ['customer_name'],
    type: 'btree'
  },
  {
    name: 'idx_customers_email',
    columns: ['customer_email'],
    type: 'btree'
  },
  {
    name: 'idx_customers_phone',
    columns: ['customer_phone'],
    type: 'btree'
  },
  {
    name: 'idx_customers_job_title',
    columns: ['job_title'],
    type: 'btree'
  },
  {
    name: 'idx_customers_city',
    columns: ['customer_city'],
    type: 'btree'
  },
  {
    name: 'idx_customers_country',
    columns: ['customer_country'],
    type: 'btree'
  },
  {
    name: 'idx_customers_is_delete',
    columns: ['is_delete'],
    type: 'btree'
  },
  {
    name: 'idx_customers_created_at',
    columns: ['created_at'],
    type: 'btree'
  }
]

// Validation rules for different operations
const customersValidationRules = {
  create: {
    required: [],
    optional: ['customer_name', 'customer_email', 'customer_phone', 'job_title', 'customer_address', 'customer_city', 'customer_state', 'customer_zip', 'customer_country']
  },
  update: {
    required: [],
    optional: ['customer_name', 'customer_email', 'customer_phone', 'job_title', 'customer_address', 'customer_city', 'customer_state', 'customer_zip', 'customer_country']
  },
  search: {
    fields: ['customer_name', 'customer_email', 'customer_phone', 'job_title', 'customer_address', 'customer_city', 'customer_state', 'customer_country']
  }
}

module.exports = {
  customersColumns,
  customersIndexes,
  customersValidationRules
}
