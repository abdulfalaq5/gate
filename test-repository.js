const UsersRepository = require('./src/modules/users/postgre_repository');
const { pgCore } = require('./src/config/database');

async function testRepository() {
  try {
    console.log('🔍 Testing UsersRepository...');
    
    const usersRepo = new UsersRepository(pgCore);
    
    // Test findByUsername
    console.log('👤 Testing findByUsername("admin")...');
    const user = await usersRepo.findByUsername('admin');
    console.log('Result:', user);
    
    // Test findByEmail
    console.log('📧 Testing findByEmail("admin@sso-testing.com")...');
    const userByEmail = await usersRepo.findByEmail('admin@sso-testing.com');
    console.log('Result:', userByEmail);
    
    // Test verifyPassword
    if (user) {
      console.log('🔐 Testing verifyPassword...');
      const isValid = await usersRepo.verifyPassword('admin123', user.user_password);
      console.log('Password valid:', isValid);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await pgCore.destroy();
  }
}

testRepository();
