const UsersHandler = require('./handler');
const {
  createUserValidation,
  updateUserValidation,
  deleteUserValidation,
  getUserValidation,
  listUsersValidation,
  loginValidation,
  changePasswordValidation,
} = require('./validation');
const { validationMiddleware } = require('../../middlewares/validation');

const usersHandler = new UsersHandler();

module.exports = {
  createUser: [createUserValidation, validationMiddleware, usersHandler.createUser.bind(usersHandler)],
  getUser: [getUserValidation, validationMiddleware, usersHandler.getUser.bind(usersHandler)],
  listUsers: [listUsersValidation, validationMiddleware, usersHandler.listUsers.bind(usersHandler)],
  getUserPermissions: [getUserValidation, validationMiddleware, usersHandler.getUserPermissions.bind(usersHandler)],
  login: [loginValidation, validationMiddleware, usersHandler.login.bind(usersHandler)],
  updateUser: [updateUserValidation, validationMiddleware, usersHandler.updateUser.bind(usersHandler)],
  deleteUser: [deleteUserValidation, validationMiddleware, usersHandler.deleteUser.bind(usersHandler)],
  restoreUser: [deleteUserValidation, validationMiddleware, usersHandler.restoreUser.bind(usersHandler)],
  changePassword: [changePasswordValidation, validationMiddleware, usersHandler.changePassword.bind(usersHandler)],
};
