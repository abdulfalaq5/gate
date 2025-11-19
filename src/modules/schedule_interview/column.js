/**
 * Column definitions for schedule_interviews table
 * Used for validation, documentation, and form generation
 */

const scheduleInterviewColumns = {
  schedule_interview_id: {
    type: 'uuid',
    primary: true,
    autoGenerate: true,
    description: 'Unique identifier for the schedule interview',
    example: '123e4567-e89b-12d3-a456-426614174000'
  },
  candidate_id: {
    type: 'uuid',
    required: false,
    description: 'Candidate ID reference',
    example: '123e4567-e89b-12d3-a456-426614174000'
  },
  assign_role: {
    type: 'string',
    required: false,
    maxLength: 255,
    description: 'Assigned role for the interview',
    example: 'Senior Developer'
  },
  schedule_interview_date: {
    type: 'date',
    required: false,
    description: 'Interview date',
    example: '2025-01-25'
  },
  schedule_interview_time: {
    type: 'time',
    required: false,
    description: 'Interview time',
    example: '14:00:00'
  },
  schedule_interview_duration: {
    type: 'string',
    required: false,
    maxLength: 255,
    description: 'Interview duration',
    example: '60 minutes'
  },
  schedule_interview_description: {
    type: 'text',
    required: false,
    description: 'Interview description',
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
const scheduleInterviewIndexes = [
  {
    name: 'idx_schedule_interviews_candidate_id',
    columns: ['candidate_id'],
    type: 'btree'
  },
  {
    name: 'idx_schedule_interviews_date',
    columns: ['schedule_interview_date'],
    type: 'btree'
  },
  {
    name: 'idx_schedule_interviews_is_delete',
    columns: ['is_delete'],
    type: 'btree'
  },
  {
    name: 'idx_schedule_interviews_created_at',
    columns: ['created_at'],
    type: 'btree'
  }
]

// Validation rules for different operations
const scheduleInterviewValidationRules = {
  create: {
    required: [],
    optional: [
      'candidate_id',
      'assign_role',
      'schedule_interview_date',
      'schedule_interview_time',
      'schedule_interview_duration',
      'schedule_interview_description'
    ]
  },
  update: {
    required: [],
    optional: [
      'candidate_id',
      'assign_role',
      'schedule_interview_date',
      'schedule_interview_time',
      'schedule_interview_duration',
      'schedule_interview_description'
    ]
  },
  search: {
    fields: [
      'assign_role',
      'schedule_interview_duration'
    ]
  }
}

module.exports = {
  scheduleInterviewColumns,
  scheduleInterviewIndexes,
  scheduleInterviewValidationRules
}

