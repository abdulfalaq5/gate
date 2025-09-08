const SystemsHandler = require('./handler');

module.exports = {
  createSystem: SystemsHandler.createSystem.bind(SystemsHandler),
  getSystem: SystemsHandler.getSystem.bind(SystemsHandler),
  listSystems: SystemsHandler.listSystems.bind(SystemsHandler),
  updateSystem: SystemsHandler.updateSystem.bind(SystemsHandler),
  deleteSystem: SystemsHandler.deleteSystem.bind(SystemsHandler),
};