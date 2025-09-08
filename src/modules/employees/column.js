/**
 * Column definitions for employees table
 */
const employeesColumns = {
  employee_id: {
    type: 'uuid',
    primary: true,
    autoGenerate: true,
    description: 'Unique identifier for the employee',
    example: '123e4567-e89b-12d3-a456-426614174000'
  },
  employee_name: {
    type: 'string',
    required: true,
    maxLength: 100,
    minLength: 2,
    description: 'Employee name',
    example: 'John Doe'
  },
  employee_email: {
    type: 'string',
    required: true,
    maxLength: 100,
    format: 'email',
    description: 'Employee email address',
    example: 'john.doe@company.com'
  },
  title_id: {
    type: 'uuid',
    required: true,
    description: 'Title ID assigned to this employee',
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

module.exports = { employeesColumns }
