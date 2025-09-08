/**
 * Column definitions for departments table
 * Used for validation, documentation, and form generation
 */

const departmentsColumns = {
  department_id: {
    type: 'uuid',
    primary: true,
    autoGenerate: true,
    description: 'Unique identifier for the department',
    example: '123e4567-e89b-12d3-a456-426614174000'
  },
  department_name: {
    type: 'string',
    required: true,
    maxLength: 100,
    minLength: 2,
    description: 'Department name',
    example: 'Human Resources'
  },
  department_parent_id: {
    type: 'uuid',
    required: false,
    description: 'Parent department ID for hierarchical structure',
    example: '123e4567-e89b-12d3-a456-426614174000'
  },
  company_id: {
    type: 'uuid',
    required: true,
    description: 'Company ID that owns this department',
    example: '123e4567-e89b-12d3-a456-426614174000'
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
const departmentsIndexes = [
  {
    name: 'idx_departments_name',
    columns: ['department_name'],
    type: 'btree'
  },
  {
    name: 'idx_departments_parent_id',
    columns: ['department_parent_id'],
    type: 'btree'
  },
  {
    name: 'idx_departments_company_id',
    columns: ['company_id'],
    type: 'btree'
  },
  {
    name: 'idx_departments_is_delete',
    columns: ['is_delete'],
    type: 'btree'
  },
  {
    name: 'idx_departments_created_at',
    columns: ['created_at'],
    type: 'btree'
  }
]

// Validation rules for different operations
const departmentsValidationRules = {
  create: {
    required: ['department_name', 'company_id'],
    optional: ['department_parent_id']
  },
  update: {
    required: [],
    optional: ['department_name', 'department_parent_id', 'company_id']
  },
  search: {
    fields: ['department_name']
  }
}

module.exports = {
  departmentsColumns,
  departmentsIndexes,
  departmentsValidationRules
}
