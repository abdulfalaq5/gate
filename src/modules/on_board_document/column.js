/**
 * Column definitions for on_board_documents table
 * Used for validation, documentation, and form generation
 */

const onBoardDocumentColumns = {
  on_board_document_id: {
    type: 'uuid',
    primary: true,
    autoGenerate: true,
    description: 'Unique identifier for the on board document',
    example: '123e4567-e89b-12d3-a456-426614174000'
  },
  candidate_id: {
    type: 'uuid',
    required: false,
    description: 'Candidate ID reference',
    example: '123e4567-e89b-12d3-a456-426614174000'
  },
  on_board_document_name: {
    type: 'string',
    required: false,
    description: 'Name of the on board document',
    example: 'Employment Contract'
  },
  on_board_document_file: {
    type: 'text',
    required: false,
    description: 'File path for on board document',
    example: 'https://example.com/files/on_board_document.pdf'
  },
  on_board_document_description: {
    type: 'text',
    required: false,
    description: 'Description of the on board document',
    example: 'Employment contract document'
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
const onBoardDocumentValidationRules = {
  create: {
    required: [],
    optional: [
      'candidate_id',
      'on_board_document_name',
      'on_board_document_file',
      'on_board_document_description'
    ]
  },
  update: {
    required: [],
    optional: [
      'candidate_id',
      'on_board_document_name',
      'on_board_document_file',
      'on_board_document_description'
    ]
  },
  search: {
    fields: [
      'on_board_document_name',
      'on_board_document_description'
    ]
  }
}

module.exports = {
  onBoardDocumentColumns,
  onBoardDocumentValidationRules
}

