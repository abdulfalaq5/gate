const Joi = require('joi');

const createSystemHasMenuSchema = Joi.object({
  system_id: Joi.string().uuid().required().messages({
    'string.uuid': 'System ID must be a valid UUID',
    'any.required': 'System ID is required'
  }),
  menu_id: Joi.string().uuid().required().messages({
    'string.uuid': 'Menu ID must be a valid UUID',
    'any.required': 'Menu ID is required'
  })
});

const updateSystemHasMenuSchema = Joi.object({
  // Untuk update, biasanya hanya metadata yang bisa diupdate
  // karena system_id dan menu_id adalah primary key
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

const getSystemHasMenuSchema = Joi.object({
  system_id: Joi.string().uuid().required().messages({
    'string.uuid': 'System ID must be a valid UUID',
    'any.required': 'System ID is required'
  }),
  menu_id: Joi.string().uuid().required().messages({
    'string.uuid': 'Menu ID must be a valid UUID',
    'any.required': 'Menu ID is required'
  })
});

const getMenusBySystemSchema = Joi.object({
  system_id: Joi.string().uuid().required().messages({
    'string.uuid': 'System ID must be a valid UUID',
    'any.required': 'System ID is required'
  })
});

const getSystemsByMenuSchema = Joi.object({
  menu_id: Joi.string().uuid().required().messages({
    'string.uuid': 'Menu ID must be a valid UUID',
    'any.required': 'Menu ID is required'
  })
});

module.exports = {
  createSystemHasMenuSchema,
  updateSystemHasMenuSchema,
  getSystemHasMenuSchema,
  getMenusBySystemSchema,
  getSystemsByMenuSchema
};
