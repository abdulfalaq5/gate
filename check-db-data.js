const knex = require('knex');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const db = knex({
  client: process.env.DB_CLIENT_DEV,
  connection: {
    host: process.env.DB_HOST_DEV,
    port: process.env.DB_PORT_DEV,
    user: process.env.DB_USER_DEV,
    password: process.env.DB_PASS_DEV,
    database: process.env.DB_NAME_DEV,
  }
});

async function checkData() {
  try {
    console.log('🔍 Checking database data...');
    
    // Check users
    const users = await db('users').select('user_name', 'user_email', 'user_id').limit(5);
    console.log('👥 Users:', users);
    
    // Check roles
    const roles = await db('roles').select('role_name', 'role_id').limit(5);
    console.log('🎭 Roles:', roles);
    
    // Check companies
    const companies = await db('companies').select('company_name', 'company_id').limit(5);
    console.log('🏢 Companies:', companies);
    
    // Check SSO clients
    const ssoClients = await db('sso_clients').select('client_id', 'name', 'is_active').limit(5);
    console.log('🔑 SSO Clients:', ssoClients);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await db.destroy();
  }
}

checkData();
