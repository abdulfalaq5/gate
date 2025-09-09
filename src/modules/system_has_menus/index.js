const SystemHasMenusHandler = require('./handler');

module.exports = {
  createSystemHasMenu: SystemHasMenusHandler.createSystemHasMenu.bind(SystemHasMenusHandler),
  getSystemHasMenu: SystemHasMenusHandler.getSystemHasMenu.bind(SystemHasMenusHandler),
  listSystemHasMenus: SystemHasMenusHandler.listSystemHasMenus.bind(SystemHasMenusHandler),
  getMenusBySystem: SystemHasMenusHandler.getMenusBySystem.bind(SystemHasMenusHandler),
  getSystemsByMenu: SystemHasMenusHandler.getSystemsByMenu.bind(SystemHasMenusHandler),
  updateSystemHasMenu: SystemHasMenusHandler.updateSystemHasMenu.bind(SystemHasMenusHandler),
  deleteSystemHasMenu: SystemHasMenusHandler.deleteSystemHasMenu.bind(SystemHasMenusHandler),
  deleteBySystem: SystemHasMenusHandler.deleteBySystem.bind(SystemHasMenusHandler),
  deleteByMenu: SystemHasMenusHandler.deleteByMenu.bind(SystemHasMenusHandler),
};
