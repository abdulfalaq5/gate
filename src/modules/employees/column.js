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
  department_id: {
    type: 'uuid',
    required: false,
    description: 'Department ID assigned to this employee',
    example: '123e4567-e89b-12d3-a456-426614174000'
  },
  gender_id: {
    type: 'uuid',
    required: false,
    description: 'Gender ID assigned to this employee',
    example: '123e4567-e89b-12d3-a456-426614174000'
  },
  employee_mobile: {
    type: 'string',
    required: false,
    maxLength: 50,
    description: 'Employee mobile phone number',
    example: '+6281234567890'
  },
  employee_office_number: {
    type: 'string',
    required: false,
    maxLength: 50,
    description: 'Employee office phone number',
    example: '+62212345678'
  },
  employee_address: {
    type: 'string',
    required: false,
    description: 'Employee home address',
    example: 'Jl. Sudirman No. 123, Jakarta'
  },
  employee_exmail_account: {
    type: 'string',
    required: false,
    maxLength: 100,
    format: 'email',
    description: 'Employee external mail account for login',
    example: 'employee@company.com'
  },
  employee_channel: {
    type: 'string',
    required: false,
    maxLength: 100,
    description: 'Employee channel or source',
    example: 'LinkedIn'
  },
  employee_activation_status: {
    type: 'string',
    required: false,
    maxLength: 50,
    description: 'Employee activation status',
    example: 'active'
  },
  employee_disabled: {
    type: 'boolean',
    required: false,
    defaultValue: false,
    description: 'Whether employee is disabled',
    example: false
  },
  employee_wechat_workplace: {
    type: 'string',
    required: false,
    maxLength: 100,
    description: 'Employee WeChat workplace ID',
    example: 'wechat_workplace_123'
  },
  island_id: {
    type: 'uuid',
    required: false,
    description: 'Island ID where employee is located',
    example: '123e4567-e89b-12d3-a456-426614174000'
  },
  employee_phone: {
    type: 'string',
    required: false,
    maxLength: 50,
    description: 'Employee phone number',
    example: '+6281234567890'
  },
  password: {
    type: 'string',
    required: false,
    maxLength: 255,
    description: 'Employee password for authentication',
    example: 'hashed_password_here'
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
const employeesValidationRules = {
  create: {
    required: ['employee_name', 'employee_email', 'title_id'],
    optional: [
      'department_id', 
      'gender_id', 
      'employee_mobile', 
      'employee_office_number', 
      'employee_address', 
      'employee_exmail_account', 
      'employee_channel', 
      'employee_activation_status', 
      'employee_disabled', 
      'employee_wechat_workplace', 
      'island_id', 
      'employee_phone', 
      'password', 
      'company_id', 
      'employeeHasPermissions'
    ] // company_id is optional and will be ignored during insert
  },
  update: {
    required: [],
    optional: [
      'employee_name', 
      'employee_email', 
      'title_id', 
      'department_id', 
      'gender_id', 
      'employee_mobile', 
      'employee_office_number', 
      'employee_address', 
      'employee_exmail_account', 
      'employee_channel', 
      'employee_activation_status', 
      'employee_disabled', 
      'employee_wechat_workplace', 
      'island_id', 
      'employee_phone', 
      'password', 
      'company_id', 
      'employeeHasPermissions'
    ]
  }
}

module.exports = { 
  employeesColumns,
  employeesValidationRules 
}
