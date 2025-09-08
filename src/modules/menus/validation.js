const { body, param, query } = require('express-validator');

const createMenuValidation = [
  body('menu_name')
    .notEmpty()
    .withMessage('Menu name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Menu name must be between 3 and 100 characters'),
  body('menu_parent_id')
    .optional()
    .isUUID()
    .withMessage('Invalid parent menu ID format'),
  body('menu_url')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Menu URL must not exceed 255 characters'),
  body('menu_icon')
    .optional()
    .isLength({ max: 150 })
    .withMessage('Menu icon must not exceed 150 characters'),
  body('menu_order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Menu order must be a non-negative integer'),
];

const updateMenuValidation = [
  param('id')
    .isUUID()
    .withMessage('Invalid menu ID format'),
  body('menu_name')
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage('Menu name must be between 3 and 100 characters'),
  body('menu_parent_id')
    .optional()
    .isUUID()
    .withMessage('Invalid parent menu ID format'),
  body('menu_url')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Menu URL must not exceed 255 characters'),
  body('menu_icon')
    .optional()
    .isLength({ max: 150 })
    .withMessage('Menu icon must not exceed 150 characters'),
  body('menu_order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Menu order must be a non-negative integer'),
];

const deleteMenuValidation = [
  param('id')
    .isUUID()
    .withMessage('Invalid menu ID format'),
];

const getMenuValidation = [
  param('id')
    .isUUID()
    .withMessage('Invalid menu ID format'),
];

const listMenusValidation = [
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
  query('parent_id')
    .optional()
    .isUUID()
    .withMessage('Invalid parent ID format'),
];

module.exports = {
  createMenuValidation,
  updateMenuValidation,
  deleteMenuValidation,
  getMenuValidation,
  listMenusValidation,
};
