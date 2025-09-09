const Joi = require('joi');

const createRoleHasMenuPermissionSchema = Joi.object({
  role_id: Joi.string().uuid().required().messages({
    'string.uuid': 'Role ID must be a valid UUID',
    'any.required': 'Role ID is required'
  }),
  menu_id: Joi.string().uuid().required().messages({
    'string.uuid': 'Menu ID must be a valid UUID',
    'any.required': 'Menu ID is required'
  }),
  permission_id: Joi.string().uuid().required().messages({
    'string.uuid': 'Permission ID must be a valid UUID',
    'any.required': 'Permission ID is required'
  })
});

const updateRoleHasMenuPermissionSchema = Joi.object({
  // Untuk update, biasanya hanya metadata yang bisa diupdate
  // karena role_id, menu_id, dan permission_id adalah primary key
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

const getRoleHasMenuPermissionSchema = Joi.object({
  role_id: Joi.string().uuid().required().messages({
    'string.uuid': 'Role ID must be a valid UUID',
    'any.required': 'Role ID is required'
  }),
  menu_id: Joi.string().uuid().required().messages({
    'string.uuid': 'Menu ID must be a valid UUID',
    'any.required': 'Menu ID is required'
  }),
  permission_id: Joi.string().uuid().required().messages({
    'string.uuid': 'Permission ID must be a valid UUID',
    'any.required': 'Permission ID is required'
  })
});

const getPermissionsByRoleSchema = Joi.object({
  role_id: Joi.string().uuid().required().messages({
    'string.uuid': 'Role ID must be a valid UUID',
    'any.required': 'Role ID is required'
  })
});

const getRolesByMenuSchema = Joi.object({
  menu_id: Joi.string().uuid().required().messages({
    'string.uuid': 'Menu ID must be a valid UUID',
    'any.required': 'Menu ID is required'
  })
});

const getRolesByPermissionSchema = Joi.object({
  permission_id: Joi.string().uuid().required().messages({
    'string.uuid': 'Permission ID must be a valid UUID',
    'any.required': 'Permission ID is required'
  })
});

const getPermissionsByRoleAndMenuSchema = Joi.object({
  role_id: Joi.string().uuid().required().messages({
    'string.uuid': 'Role ID must be a valid UUID',
    'any.required': 'Role ID is required'
  }),
  menu_id: Joi.string().uuid().required().messages({
    'string.uuid': 'Menu ID must be a valid UUID',
    'any.required': 'Menu ID is required'
  })
});

module.exports = {
  createRoleHasMenuPermissionSchema,
  updateRoleHasMenuPermissionSchema,
  getRoleHasMenuPermissionSchema,
  getPermissionsByRoleSchema,
  getRolesByMenuSchema,
  getRolesByPermissionSchema,
  getPermissionsByRoleAndMenuSchema
};
