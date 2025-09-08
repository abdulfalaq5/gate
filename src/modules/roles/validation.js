const { body, param, query } = require('express-validator');

const createRoleValidation = [
  body('role_name')
    .notEmpty()
    .withMessage('Role name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Role name must be between 3 and 100 characters'),
  body('role_parent_id')
    .optional()
    .isUUID()
    .withMessage('Invalid parent role ID format'),
];

const updateRoleValidation = [
  param('id')
    .isUUID()
    .withMessage('Invalid role ID format'),
  body('role_name')
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage('Role name must be between 3 and 100 characters'),
  body('role_parent_id')
    .optional()
    .isUUID()
    .withMessage('Invalid parent role ID format'),
];

const deleteRoleValidation = [
  param('id')
    .isUUID()
    .withMessage('Invalid role ID format'),
];

const getRoleValidation = [
  param('id')
    .isUUID()
    .withMessage('Invalid role ID format'),
];

const listRolesValidation = [
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

const assignPermissionsValidation = [
  param('id')
    .isUUID()
    .withMessage('Invalid role ID format'),
  body('permissions')
    .isArray()
    .withMessage('Permissions must be an array'),
  body('permissions.*.menu_id')
    .isUUID()
    .withMessage('Invalid menu ID format'),
  body('permissions.*.permission_id')
    .isUUID()
    .withMessage('Invalid permission ID format'),
];

module.exports = {
  createRoleValidation,
  updateRoleValidation,
  deleteRoleValidation,
  getRoleValidation,
  listRolesValidation,
  assignPermissionsValidation,
};
