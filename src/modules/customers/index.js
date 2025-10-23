const CustomersHandler = require('./handler');

module.exports = {
  getCustomers: CustomersHandler.getCustomers.bind(CustomersHandler),
  getCustomerById: CustomersHandler.getCustomerById.bind(CustomersHandler),
  createCustomer: CustomersHandler.createCustomer.bind(CustomersHandler),
  updateCustomer: CustomersHandler.updateCustomer.bind(CustomersHandler),
  deleteCustomer: CustomersHandler.deleteCustomer.bind(CustomersHandler),
  getCustomersStats: CustomersHandler.getCustomersStats.bind(CustomersHandler),
};
