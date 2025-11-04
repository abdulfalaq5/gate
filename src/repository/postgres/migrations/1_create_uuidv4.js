exports.up = async function (knex) {
  // Check if uuid_generate_v4 function already exists
  try {
    const funcCheck = await knex.raw(`
      SELECT 1 FROM pg_proc WHERE proname = 'uuid_generate_v4'
    `);
    
    if (funcCheck.rows.length > 0) {
      console.log('✅ uuid_generate_v4 function already exists, skipping extension creation');
      return; // Early return if function exists
    }
  } catch (error) {
    // Continue if check fails
  }
  
  // Check if extension already exists
  try {
    const extCheck = await knex.raw(`
      SELECT 1 FROM pg_extension WHERE extname = 'uuid-ossp'
    `);
    
    if (extCheck.rows.length > 0) {
      console.log('✅ uuid-ossp extension already exists');
      return; // Early return if extension exists
    }
  } catch (error) {
    // Continue if check fails
  }
  
  // Try to create extension, but don't fail migration if it fails
  try {
    await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    console.log('✅ Created uuid-ossp extension');
  } catch (error) {
    // If permission denied, migration will continue
    // The function might be available from template database
    console.warn('⚠️  Cannot create uuid-ossp extension:', error.message);
    console.warn('   Migration will continue. If uuid_generate_v4 is needed,');
    console.warn('   create extension manually: CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    // Don't throw - let migration continue
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  try {
    await knex.raw('DROP EXTENSION IF EXISTS "uuid-ossp"');
  } catch (error) {
    // Ignore errors on down migration
    console.warn('⚠️  Extension drop skipped:', error.message);
  }
};
