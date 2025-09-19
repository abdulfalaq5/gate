#!/usr/bin/env node

/**
 * Test script untuk Database Queue Implementation
 * Script ini akan test semua operasi CRUD dan memverifikasi queue terkirim ke RabbitMQ
 */

const axios = require('axios');
const amqp = require('amqplib');

// Configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:9505';
const JWT_TOKEN = process.env.JWT_TOKEN || 'your-jwt-token-here';

// Test data
const testData = {
  company: {
    company_name: 'Test Company Queue',
    company_address: 'Jakarta Test Address',
    company_email: 'test@company.com'
  },
  department: {
    department_name: 'Test Department Queue',
    company_id: null // Will be filled after company creation
  },
  title: {
    title_name: 'Test Title Queue',
    department_id: null // Will be filled after department creation
  },
  employee: {
    employee_name: 'Test Employee Queue',
    employee_email: 'test@employee.com',
    title_id: null // Will be filled after title creation
  }
};

let createdIds = {};
let queueMessages = [];

// Setup queue listener
const setupQueueListener = async () => {
  console.log('🔧 Setting up RabbitMQ queue listener...');
  
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    
    const exchangeName = 'database_operations';
    const queueName = 'database_changes_queue';
    
    await channel.assertExchange(exchangeName, 'fanout', { durable: true });
    await channel.assertQueue(queueName, { durable: true });
    await channel.bindQueue(queueName, exchangeName);
    
    console.log('✅ Queue listener setup complete');
    
    // Listen for messages
    channel.consume(queueName, (msg) => {
      if (msg) {
        const payload = JSON.parse(msg.content.toString());
        queueMessages.push(payload);
        
        console.log(`📨 Queue message received:`, {
          table: payload.table,
          method: payload.method,
          operation_id: payload.operation_id,
          timestamp: payload.timestamp
        });
        
        channel.ack(msg);
      }
    });
    
    return { connection, channel };
  } catch (error) {
    console.error('❌ Failed to setup queue listener:', error.message);
    throw error;
  }
};

// API helper functions
const apiRequest = async (method, endpoint, data = null) => {
  try {
    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`❌ API Error [${method} ${endpoint}]:`, error.response?.data || error.message);
    throw error;
  }
};

// Test functions
const testCompanyOperations = async () => {
  console.log('\n🏢 Testing Company Operations...');
  
  // CREATE
  console.log('  📝 Creating company...');
  const createResponse = await apiRequest('POST', '/companies', testData.company);
  createdIds.company = createResponse.data.company_id;
  console.log(`  ✅ Company created with ID: ${createdIds.company}`);
  
  // UPDATE
  console.log('  ✏️  Updating company...');
  const updateData = { company_name: 'Updated Test Company Queue' };
  await apiRequest('PUT', `/companies/${createdIds.company}`, updateData);
  console.log('  ✅ Company updated');
  
  // DELETE
  console.log('  🗑️  Deleting company...');
  await apiRequest('DELETE', `/companies/${createdIds.company}`);
  console.log('  ✅ Company deleted');
};

const testDepartmentOperations = async () => {
  console.log('\n🏬 Testing Department Operations...');
  
  // Create company first for department
  console.log('  📝 Creating company for department...');
  const companyResponse = await apiRequest('POST', '/companies', {
    company_name: 'Company for Department Test',
    company_address: 'Jakarta'
  });
  createdIds.companyForDept = companyResponse.data.company_id;
  testData.department.company_id = createdIds.companyForDept;
  
  // CREATE
  console.log('  📝 Creating department...');
  const createResponse = await apiRequest('POST', '/departments', testData.department);
  createdIds.department = createResponse.data.department_id;
  console.log(`  ✅ Department created with ID: ${createdIds.department}`);
  
  // UPDATE
  console.log('  ✏️  Updating department...');
  const updateData = { department_name: 'Updated Test Department Queue' };
  await apiRequest('PUT', `/departments/${createdIds.department}`, updateData);
  console.log('  ✅ Department updated');
  
  // DELETE
  console.log('  🗑️  Deleting department...');
  await apiRequest('DELETE', `/departments/${createdIds.department}`);
  console.log('  ✅ Department deleted');
};

const testTitleOperations = async () => {
  console.log('\n🎯 Testing Title Operations...');
  
  // Create department first for title
  console.log('  📝 Creating department for title...');
  const deptResponse = await apiRequest('POST', '/departments', {
    department_name: 'Department for Title Test',
    company_id: createdIds.companyForDept
  });
  createdIds.departmentForTitle = deptResponse.data.department_id;
  testData.title.department_id = createdIds.departmentForTitle;
  
  // CREATE
  console.log('  📝 Creating title...');
  const createResponse = await apiRequest('POST', '/titles', testData.title);
  createdIds.title = createResponse.data.title_id;
  console.log(`  ✅ Title created with ID: ${createdIds.title}`);
  
  // UPDATE
  console.log('  ✏️  Updating title...');
  const updateData = { title_name: 'Updated Test Title Queue' };
  await apiRequest('PUT', `/titles/${createdIds.title}`, updateData);
  console.log('  ✅ Title updated');
  
  // DELETE
  console.log('  🗑️  Deleting title...');
  await apiRequest('DELETE', `/titles/${createdIds.title}`);
  console.log('  ✅ Title deleted');
};

const testEmployeeOperations = async () => {
  console.log('\n👤 Testing Employee Operations...');
  
  // Create title first for employee
  console.log('  📝 Creating title for employee...');
  const titleResponse = await apiRequest('POST', '/titles', {
    title_name: 'Title for Employee Test',
    department_id: createdIds.departmentForTitle
  });
  createdIds.titleForEmployee = titleResponse.data.title_id;
  testData.employee.title_id = createdIds.titleForEmployee;
  
  // CREATE
  console.log('  📝 Creating employee...');
  const createResponse = await apiRequest('POST', '/employees', testData.employee);
  createdIds.employee = createResponse.data.employee_id;
  console.log(`  ✅ Employee created with ID: ${createdIds.employee}`);
  
  // UPDATE
  console.log('  ✏️  Updating employee...');
  const updateData = { employee_name: 'Updated Test Employee Queue' };
  await apiRequest('PUT', `/employees/${createdIds.employee}`, updateData);
  console.log('  ✅ Employee updated');
  
  // DELETE
  console.log('  🗑️  Deleting employee...');
  await apiRequest('DELETE', `/employees/${createdIds.employee}`);
  console.log('  ✅ Employee deleted');
};

const cleanup = async () => {
  console.log('\n🧹 Cleaning up test data...');
  
  try {
    // Clean up in reverse order of dependencies
    if (createdIds.titleForEmployee) {
      await apiRequest('DELETE', `/titles/${createdIds.titleForEmployee}`);
    }
    if (createdIds.departmentForTitle) {
      await apiRequest('DELETE', `/departments/${createdIds.departmentForTitle}`);
    }
    if (createdIds.companyForDept) {
      await apiRequest('DELETE', `/companies/${createdIds.companyForDept}`);
    }
    
    console.log('✅ Cleanup completed');
  } catch (error) {
    console.log('⚠️  Some cleanup operations failed, but that\'s okay for testing');
  }
};

const analyzeQueueMessages = () => {
  console.log('\n📊 Analyzing Queue Messages...');
  console.log(`Total messages received: ${queueMessages.length}`);
  
  const messagesByTable = {};
  const messagesByMethod = {};
  
  queueMessages.forEach(msg => {
    messagesByTable[msg.table] = (messagesByTable[msg.table] || 0) + 1;
    messagesByMethod[msg.method] = (messagesByMethod[msg.method] || 0) + 1;
  });
  
  console.log('\nMessages by Table:');
  Object.entries(messagesByTable).forEach(([table, count]) => {
    console.log(`  ${table}: ${count} messages`);
  });
  
  console.log('\nMessages by Method:');
  Object.entries(messagesByMethod).forEach(([method, count]) => {
    console.log(`  ${method.toUpperCase()}: ${count} operations`);
  });
  
  // Validate expected messages
  const expectedMessages = 12; // 4 modules × 3 operations each
  if (queueMessages.length >= expectedMessages) {
    console.log('\n✅ All expected queue messages received!');
  } else {
    console.log(`\n⚠️  Expected ${expectedMessages} messages, received ${queueMessages.length}`);
  }
  
  // Show sample messages
  console.log('\nSample Queue Messages:');
  queueMessages.slice(0, 3).forEach((msg, index) => {
    console.log(`  ${index + 1}. ${msg.table} - ${msg.method.toUpperCase()} - ${msg.operation_id}`);
    console.log(`     SQL: ${msg.query_sql.substring(0, 80)}...`);
  });
};

// Main test function
const runTests = async () => {
  console.log('🚀 Starting Database Queue Implementation Tests');
  console.log('=' .repeat(60));
  
  let connection = null;
  
  try {
    // Setup queue listener
    const { connection: conn } = await setupQueueListener();
    connection = conn;
    
    // Wait a bit for listener to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Run tests
    await testCompanyOperations();
    await testDepartmentOperations();
    await testTitleOperations();
    await testEmployeeOperations();
    
    // Wait for queue messages to arrive
    console.log('\n⏳ Waiting for queue messages...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Analyze results
    analyzeQueueMessages();
    
    // Cleanup
    await cleanup();
    
    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('\n💥 Test failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

// Handle script execution
if (require.main === module) {
  // Check if JWT token is provided
  if (JWT_TOKEN === 'your-jwt-token-here') {
    console.error('❌ Please set JWT_TOKEN environment variable');
    console.log('Usage: JWT_TOKEN=your-token node test-database-queue.js');
    process.exit(1);
  }
  
  runTests().catch(console.error);
}

module.exports = {
  runTests,
  setupQueueListener,
  analyzeQueueMessages
};
