const { body, param, query } = require('express-validator');

const createPermissionValidation = [
  body('permission_name')
    .notEmpty()
    .withMessage('Permission name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Permission name must be between 3 and 100 characters'),
];

const updatePermissionValidation = [
  param('id')
    .isUUID()
    .withMessage('Invalid permission ID format'),
  body('permission_name')
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage('Permission name must be between 3 and 100 characters'),
];

const deletePermissionValidation = [
  param('id')
    .isUUID()
    .withMessage('Invalid permission ID format'),
];

const getPermissionValidation = [
  param('id')
    .isUUID()
    .withMessage('Invalid permission ID format'),
];

const listPermissionsValidation = [
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
  createPermissionValidation,
  updatePermissionValidation,
  deletePermissionValidation,
  getPermissionValidation,
  listPermissionsValidation,
};
