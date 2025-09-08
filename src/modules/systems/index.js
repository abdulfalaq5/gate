const SystemsHandler = require('./handler');
const {
  createSystemValidation,
  updateSystemValidation,
  deleteSystemValidation,
  getSystemValidation,
  listSystemsValidation,
} = require('./validation');
const { validationMiddleware } = require('../../middlewares/validation');

const systemsHandler = new SystemsHandler();

module.exports = {
  createSystem: [createSystemValidation, validationMiddleware, systemsHandler.createSystem.bind(systemsHandler)],
  getSystem: [getSystemValidation, validationMiddleware, systemsHandler.getSystem.bind(systemsHandler)],
  listSystems: [listSystemsValidation, validationMiddleware, systemsHandler.listSystems.bind(systemsHandler)],
  updateSystem: [updateSystemValidation, validationMiddleware, systemsHandler.updateSystem.bind(systemsHandler)],
  deleteSystem: [deleteSystemValidation, validationMiddleware, systemsHandler.deleteSystem.bind(systemsHandler)],
  restoreSystem: [deleteSystemValidation, validationMiddleware, systemsHandler.restoreSystem.bind(systemsHandler)],
};
