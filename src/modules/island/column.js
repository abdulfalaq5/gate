/**
 * Column definitions for islands table
 * Used for validation, documentation, and form generation
 */

const islandsColumns = {
  island_id: {
    type: 'uuid',
    primary: true,
    autoGenerate: true,
    description: 'Unique identifier for the island',
    example: '123e4567-e89b-12d3-a456-426614174000'
  },
  island_name: {
    type: 'string',
    required: true,
    maxLength: 100,
    minLength: 1,
    description: 'Island name',
    example: 'Jawa'
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
const islandsIndexes = [
  {
    name: 'idx_islands_name',
    columns: ['island_name'],
    type: 'btree'
  },
  {
    name: 'idx_islands_is_delete',
    columns: ['is_delete'],
    type: 'btree'
  },
  {
    name: 'idx_islands_created_at',
    columns: ['created_at'],
    type: 'btree'
  }
]

// Validation rules for different operations
const islandsValidationRules = {
  create: {
    required: ['island_name'],
    optional: []
  },
  update: {
    required: [],
    optional: ['island_name']
  },
  search: {
    fields: ['island_name']
  }
}

module.exports = {
  islandsColumns,
  islandsIndexes,
  islandsValidationRules
}

