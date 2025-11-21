/**
 * Column definitions for notes table
 * Used for validation, documentation, and form generation
 */

const noteColumns = {
  note_id: {
    type: 'uuid',
    primary: true,
    autoGenerate: true,
    description: 'Unique identifier for the note',
    example: '123e4567-e89b-12d3-a456-426614174000'
  },
  candidate_id: {
    type: 'uuid',
    required: false,
    description: 'Candidate ID reference',
    example: '123e4567-e89b-12d3-a456-426614174000'
  },
  employee_id: {
    type: 'uuid',
    required: false,
    description: 'Employee ID who created the note (from token)',
    example: '123e4567-e89b-12d3-a456-426614174000'
  },
  notes: {
    type: 'text',
    required: false,
    description: 'Note content',
    example: 'Candidate passed initial screening'
  },
  noted_description: {
    type: 'text',
    required: false,
    description: 'Detailed description of the note',
    example: 'Candidate showed excellent communication skills during interview'
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

// Validation rules for different operations
const noteValidationRules = {
  create: {
    required: [],
    optional: [
      'candidate_id',
      'notes',
      'noted_description'
    ]
  },
  update: {
    required: [],
    optional: [
      'candidate_id',
      'notes',
      'noted_description'
    ]
  },
  search: {
    fields: [
      'notes',
      'noted_description'
    ]
  }
}

module.exports = {
  noteColumns,
  noteValidationRules
}

