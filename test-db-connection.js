// Script untuk test koneksi database dari dalam container
const knex = require('knex');
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
console.log('Environment:', env);
console.log('DB Config:', {
  host: process.env[`DB_HOST_${env.toUpperCase()}`] || process.env.DB_HOST_DEV,
  port: process.env[`DB_PORT_${env.toUpperCase()}`] || process.env.DB_PORT_DEV,
  user: process.env[`DB_USER_${env.toUpperCase()}`] || process.env.DB_USER_DEV,
  database: process.env[`DB_NAME_${env.toUpperCase()}`] || process.env.DB_NAME_DEV,
});

// Test beberapa database name yang mungkin
const possibleDatabases = [
  process.env.DB_NAME_DEV,
  'gate_db',
  'gate_sso',
  'gate',
  'postgres', // default PostgreSQL database
];

async function testConnection(dbName) {
  const config = {
    client: process.env.DB_CLIENT_DEV || 'pg',
    connection: {
      host: process.env.DB_HOST_DEV || 'localhost',
      port: process.env.DB_PORT_DEV || 5432,
      user: process.env.DB_USER_DEV || 'postgres',
      password: process.env.DB_PASS_DEV || 'password',
      database: dbName,
    },
  };

  const db = knex(config);
  
  try {
    console.log(`\n🔍 Testing database: ${dbName}`);
    const result = await db.raw('SELECT NOW() as current_time, version() as version, current_database() as db_name');
    console.log('✅ Database connection successful!');
    console.log('Database name:', result.rows[0].db_name);
    console.log('Current time:', result.rows[0].current_time);
    console.log('PostgreSQL version:', result.rows[0].version);
    
    // Test query employees table
    try {
      const employees = await db('employees').limit(1);
      console.log('✅ Employees table accessible. Sample:', employees.length > 0 ? employees[0] : 'No data');
      
      await db.destroy();
      return { success: true, database: dbName };
    } catch (tableError) {
      console.log('⚠️  Database exists but employees table not found:', tableError.message);
      await db.destroy();
      return { success: true, database: dbName, note: 'employees table not found' };
    }
  } catch (error) {
    console.error(`❌ Database "${dbName}" failed!`);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    await db.destroy();
    return { success: false, database: dbName, error: error.message };
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('DATABASE CONNECTION TEST');
  console.log('='.repeat(60));
  
  const results = [];
  for (const dbName of possibleDatabases) {
    const result = await testConnection(dbName);
    results.push(result);
    if (result.success && !result.note) {
      console.log('\n✅✅✅ FOUND WORKING DATABASE:', dbName);
      break;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY:');
  console.log('='.repeat(60));
  results.forEach(r => {
    if (r.success) {
      console.log(`✅ ${r.database} - Connected${r.note ? ' (' + r.note + ')' : ''}`);
    } else {
      console.log(`❌ ${r.database} - ${r.error}`);
    }
  });
}

main().catch(console.error);

