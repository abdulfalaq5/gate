const EmployeesHandler = require('./handler');

module.exports = {
  getEmployees: EmployeesHandler.getEmployees.bind(EmployeesHandler),
  getEmployeeById: EmployeesHandler.getEmployeeById.bind(EmployeesHandler),
  createEmployee: EmployeesHandler.createEmployee.bind(EmployeesHandler),
  updateEmployee: EmployeesHandler.updateEmployee.bind(EmployeesHandler),
  deleteEmployee: EmployeesHandler.deleteEmployee.bind(EmployeesHandler),
  getEmployeesByTitle: EmployeesHandler.getEmployeesByTitle.bind(EmployeesHandler),
  resetPassword: EmployeesHandler.resetPassword.bind(EmployeesHandler),
  getMenuPermissions: EmployeesHandler.getMenuPermissions.bind(EmployeesHandler),
};
