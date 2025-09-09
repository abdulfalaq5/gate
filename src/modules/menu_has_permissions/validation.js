const Joi = require('joi');

const createMenuHasPermissionSchema = Joi.object({
  menu_id: Joi.string().uuid().required().messages({
    'string.uuid': 'Menu ID must be a valid UUID',
    'any.required': 'Menu ID is required'
  }),
  permission_id: Joi.string().uuid().required().messages({
    'string.uuid': 'Permission ID must be a valid UUID',
    'any.required': 'Permission ID is required'
  })
});

const updateMenuHasPermissionSchema = Joi.object({
  // Untuk update, biasanya hanya metadata yang bisa diupdate
  // karena menu_id dan permission_id adalah primary key
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

const getMenuHasPermissionSchema = Joi.object({
  menu_id: Joi.string().uuid().required().messages({
    'string.uuid': 'Menu ID must be a valid UUID',
    'any.required': 'Menu ID is required'
  }),
  permission_id: Joi.string().uuid().required().messages({
    'string.uuid': 'Permission ID must be a valid UUID',
    'any.required': 'Permission ID is required'
  })
});

const getPermissionsByMenuSchema = Joi.object({
  menu_id: Joi.string().uuid().required().messages({
    'string.uuid': 'Menu ID must be a valid UUID',
    'any.required': 'Menu ID is required'
  })
});

const getMenusByPermissionSchema = Joi.object({
  permission_id: Joi.string().uuid().required().messages({
    'string.uuid': 'Permission ID must be a valid UUID',
    'any.required': 'Permission ID is required'
  })
});

module.exports = {
  createMenuHasPermissionSchema,
  updateMenuHasPermissionSchema,
  getMenuHasPermissionSchema,
  getPermissionsByMenuSchema,
  getMenusByPermissionSchema
};
