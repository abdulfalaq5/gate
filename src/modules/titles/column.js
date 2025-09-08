/**
 * Column definitions for titles table
 */
const titlesColumns = {
  title_id: {
    type: 'uuid',
    primary: true,
    autoGenerate: true,
    description: 'Unique identifier for the title',
    example: '123e4567-e89b-12d3-a456-426614174000'
  },
  title_name: {
    type: 'string',
    required: true,
    maxLength: 100,
    minLength: 2,
    description: 'Title name',
    example: 'Senior Developer'
  },
  department_id: {
    type: 'uuid',
    required: true,
    description: 'Department ID that owns this title',
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

module.exports = { titlesColumns }
