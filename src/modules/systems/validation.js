const { body, param, query } = require('express-validator');

const createSystemValidation = [
  body('system_name')
    .notEmpty()
    .withMessage('System name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('System name must be between 3 and 100 characters'),
  body('system_url')
    .optional()
    .isLength({ max: 255 })
    .withMessage('System URL must not exceed 255 characters'),
  body('system_icon')
    .optional()
    .isLength({ max: 150 })
    .withMessage('System icon must not exceed 150 characters'),
  body('system_order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('System order must be a non-negative integer'),
];

const updateSystemValidation = [
  param('id')
    .isUUID()
    .withMessage('Invalid system ID format'),
  body('system_name')
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage('System name must be between 3 and 100 characters'),
  body('system_url')
    .optional()
    .isLength({ max: 255 })
    .withMessage('System URL must not exceed 255 characters'),
  body('system_icon')
    .optional()
    .isLength({ max: 150 })
    .withMessage('System icon must not exceed 150 characters'),
  body('system_order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('System order must be a non-negative integer'),
];

const deleteSystemValidation = [
  param('id')
    .isUUID()
    .withMessage('Invalid system ID format'),
];

const getSystemValidation = [
  param('id')
    .isUUID()
    .withMessage('Invalid system ID format'),
];

const listSystemsValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('search')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search term must be between 1 and 100 characters'),
];

module.exports = {
  createSystemValidation,
  updateSystemValidation,
  deleteSystemValidation,
  getSystemValidation,
  listSystemsValidation,
};
