/**
 * Column definitions for interviews table
 * Used for validation, documentation, and form generation
 */

const interviewColumns = {
  interview_id: {
    type: 'uuid',
    primary: true,
    autoGenerate: true,
    description: 'Unique identifier for the interview',
    example: '123e4567-e89b-12d3-a456-426614174000'
  },
  schedule_interview_id: {
    type: 'uuid',
    required: false,
    description: 'Schedule interview ID reference',
    example: '123e4567-e89b-12d3-a456-426614174000'
  },
  employee_id: {
    type: 'uuid',
    required: false,
    description: 'Employee ID who conducted the interview',
    example: '123e4567-e89b-12d3-a456-426614174000'
  },
  interview_company_value: {
    type: 'string',
    required: false,
    maxLength: 255,
    description: 'Company value assessed in the interview',
    example: 'Integrity'
  },
  interview_comment: {
    type: 'string',
    required: false,
    maxLength: 255,
    description: 'Comment about the interview',
    example: 'Kandidat menunjukkan kemampuan leadership yang baik.'
  },
  interview_total_score: {
    type: 'string',
    required: false,
    maxLength: 255,
    description: 'Total score of the interview',
    example: '98'
  },
  interview_description: {
    type: 'string',
    required: false,
    maxLength: 255,
    description: 'Description of the interview',
    example: 'Technical interview for senior developer position'
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
const interviewIndexes = [
  {
    name: 'idx_interviews_schedule_interview_id',
    columns: ['schedule_interview_id'],
    type: 'btree'
  },
  {
    name: 'idx_interviews_employee_id',
    columns: ['employee_id'],
    type: 'btree'
  },
  {
    name: 'idx_interviews_is_delete',
    columns: ['is_delete'],
    type: 'btree'
  },
  {
    name: 'idx_interviews_created_at',
    columns: ['created_at'],
    type: 'btree'
  }
]

// Validation rules for different operations
const interviewValidationRules = {
  create: {
    required: [],
    optional: [
      'schedule_interview_id',
      'employee_id',
      'interview_company_value',
      'interview_comment',
      'interview_total_score',
      'interview_description'
    ]
  },
  update: {
    required: [],
    optional: [
      'schedule_interview_id',
      'employee_id',
      'interview_company_value',
      'interview_comment',
      'interview_total_score',
      'interview_description'
    ]
  },
  search: {
    fields: [
      'interview_company_value',
      'interview_comment',
      'interview_total_score',
      'interview_description'
    ]
  }
}

module.exports = {
  interviewColumns,
  interviewIndexes,
  interviewValidationRules
}

