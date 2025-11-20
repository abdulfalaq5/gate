/**
 * Column definitions for background_checks table
 * Used for validation, documentation, and form generation
 */

const backgroundCheckColumns = {
  background_check_id: {
    type: 'uuid',
    primary: true,
    autoGenerate: true,
    description: 'Unique identifier for the background check',
    example: '123e4567-e89b-12d3-a456-426614174000'
  },
  candidate_id: {
    type: 'uuid',
    required: false,
    description: 'Candidate ID reference',
    example: '123e4567-e89b-12d3-a456-426614174000'
  },
  background_check_note: {
    type: 'text',
    required: false,
    description: 'Note for the background check',
    example: 'Background check completed successfully'
  },
  background_file: {
    type: 'text',
    required: false,
    description: 'File path for background check document',
    example: 'https://example.com/files/background_check.pdf'
  },
  background_status: {
    type: 'enum',
    enumValues: ['hired', 'rejected', 'hold'],
    required: false,
    description: 'Status of the background check',
    example: 'hired'
  },
  background_description: {
    type: 'text',
    required: false,
    description: 'Description of the background check',
    example: 'All checks passed'
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
const backgroundCheckValidationRules = {
  create: {
    required: [],
    optional: [
      'candidate_id',
      'background_check_note',
      'background_file',
      'background_status',
      'background_description'
    ]
  },
  update: {
    required: [],
    optional: [
      'candidate_id',
      'background_check_note',
      'background_file',
      'background_status',
      'background_description'
    ]
  },
  search: {
    fields: [
      'background_check_note',
      'background_description'
    ]
  }
}

module.exports = {
  backgroundCheckColumns,
  backgroundCheckValidationRules
}

