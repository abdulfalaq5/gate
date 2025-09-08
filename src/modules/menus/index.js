const MenusHandler = require('./handler');
const {
  createMenuValidation,
  updateMenuValidation,
  deleteMenuValidation,
  getMenuValidation,
  listMenusValidation,
} = require('./validation');
const { validationMiddleware } = require('../../middlewares/validation');

const menusHandler = new MenusHandler();

module.exports = {
  createMenu: [createMenuValidation, validationMiddleware, menusHandler.createMenu.bind(menusHandler)],
  getMenu: [getMenuValidation, validationMiddleware, menusHandler.getMenu.bind(menusHandler)],
  listMenus: [listMenusValidation, validationMiddleware, menusHandler.listMenus.bind(menusHandler)],
  getMenuTree: [menusHandler.getMenuTree.bind(menusHandler)],
  updateMenu: [updateMenuValidation, validationMiddleware, menusHandler.updateMenu.bind(menusHandler)],
  deleteMenu: [deleteMenuValidation, validationMiddleware, menusHandler.deleteMenu.bind(menusHandler)],
  restoreMenu: [deleteMenuValidation, validationMiddleware, menusHandler.restoreMenu.bind(menusHandler)],
};
