/**
 * Column definitions for candidates table
 * Used for validation, documentation, and form generation
 */

const candidatesColumns = {
  candidate_id: {
    type: 'uuid',
    primary: true,
    autoGenerate: true,
    description: 'Unique identifier for the candidate',
    example: '123e4567-e89b-12d3-a456-426614174000'
  },
  company_id: {
    type: 'uuid',
    required: false,
    description: 'Company ID reference',
    example: '123e4567-e89b-12d3-a456-426614174000'
  },
  department_id: {
    type: 'uuid',
    required: false,
    description: 'Department ID reference',
    example: '123e4567-e89b-12d3-a456-426614174000'
  },
  title_id: {
    type: 'uuid',
    required: false,
    description: 'Title ID reference',
    example: '123e4567-e89b-12d3-a456-426614174000'
  },
  candidate_name: {
    type: 'string',
    required: false,
    maxLength: 255,
    description: 'Candidate name',
    example: 'John Doe'
  },
  candidate_email: {
    type: 'string',
    required: false,
    maxLength: 255,
    format: 'email',
    description: 'Candidate email address',
    example: 'john.doe@example.com'
  },
  candidate_phone: {
    type: 'string',
    required: false,
    maxLength: 255,
    description: 'Candidate phone number',
    example: '+6281234567890'
  },
  candidate_religion: {
    type: 'string',
    required: false,
    maxLength: 255,
    description: 'Candidate religion',
    example: 'Islam'
  },
  candidate_gender: {
    type: 'string',
    required: false,
    maxLength: 255,
    description: 'Candidate gender',
    example: 'Male'
  },
  candidate_marital_status: {
    type: 'string',
    required: false,
    maxLength: 255,
    description: 'Candidate marital status',
    example: 'Single'
  },
  candidate_age: {
    type: 'integer',
    required: false,
    description: 'Candidate age',
    example: 25
  },
  candidate_date_birth: {
    type: 'date',
    required: false,
    description: 'Candidate date of birth',
    example: '1998-01-01'
  },
  candidate_nationality: {
    type: 'string',
    required: false,
    maxLength: 255,
    description: 'Candidate nationality',
    example: 'Indonesian'
  },
  candidate_city: {
    type: 'string',
    required: false,
    maxLength: 255,
    description: 'Candidate city',
    example: 'Jakarta'
  },
  candidate_state: {
    type: 'string',
    required: false,
    maxLength: 255,
    description: 'Candidate state/province',
    example: 'DKI Jakarta'
  },
  candidate_country: {
    type: 'string',
    required: false,
    maxLength: 255,
    description: 'Candidate country',
    example: 'Indonesia'
  },
  candidate_address: {
    type: 'text',
    required: false,
    description: 'Candidate address',
    example: 'Jl. Sudirman No. 123, Jakarta Selatan'
  },
  candidate_foto: {
    type: 'text',
    required: false,
    description: 'Candidate photo URL/path',
    example: 'https://example.com/photos/candidate.jpg'
  },
  candidate_resume: {
    type: 'text',
    required: false,
    description: 'Candidate resume URL/path',
    example: 'https://example.com/resumes/candidate.pdf'
  },
  candidate_number: {
    type: 'string',
    required: false,
    maxLength: 255,
    description: 'Candidate number',
    example: 'CAND-001'
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
const candidatesIndexes = [
  {
    name: 'idx_candidates_name',
    columns: ['candidate_name'],
    type: 'btree'
  },
  {
    name: 'idx_candidates_email',
    columns: ['candidate_email'],
    type: 'btree'
  },
  {
    name: 'idx_candidates_phone',
    columns: ['candidate_phone'],
    type: 'btree'
  },
  {
    name: 'idx_candidates_company_id',
    columns: ['company_id'],
    type: 'btree'
  },
  {
    name: 'idx_candidates_department_id',
    columns: ['department_id'],
    type: 'btree'
  },
  {
    name: 'idx_candidates_title_id',
    columns: ['title_id'],
    type: 'btree'
  },
  {
    name: 'idx_candidates_is_delete',
    columns: ['is_delete'],
    type: 'btree'
  },
  {
    name: 'idx_candidates_created_at',
    columns: ['created_at'],
    type: 'btree'
  }
]

// Validation rules for different operations
const candidatesValidationRules = {
  create: {
    required: [],
    optional: [
      'company_id',
      'department_id',
      'title_id',
      'candidate_name',
      'candidate_email',
      'candidate_phone',
      'candidate_religion',
      'candidate_gender',
      'candidate_marital_status',
      'candidate_age',
      'candidate_date_birth',
      'candidate_nationality',
      'candidate_city',
      'candidate_state',
      'candidate_country',
      'candidate_address',
      'candidate_foto',
      'candidate_resume',
      'candidate_number'
    ]
  },
  update: {
    required: [],
    optional: [
      'company_id',
      'department_id',
      'title_id',
      'candidate_name',
      'candidate_email',
      'candidate_phone',
      'candidate_religion',
      'candidate_gender',
      'candidate_marital_status',
      'candidate_age',
      'candidate_date_birth',
      'candidate_nationality',
      'candidate_city',
      'candidate_state',
      'candidate_country',
      'candidate_address',
      'candidate_foto',
      'candidate_resume',
      'candidate_number'
    ]
  },
  search: {
    fields: [
      'candidate_name',
      'candidate_email',
      'candidate_phone',
      'candidate_number',
      'candidate_city',
      'candidate_state',
      'candidate_country'
    ]
  }
}

module.exports = {
  candidatesColumns,
  candidatesIndexes,
  candidatesValidationRules
}

