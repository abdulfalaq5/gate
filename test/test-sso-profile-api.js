/**
 * SSO Profile API Test - JavaScript
 * Contoh penggunaan endpoint profil SSO
 */

const BASE_URL = 'http://localhost:3000/api';
let jwtToken = ''; // Isi dengan token JWT yang valid

// Function untuk membuat request dengan error handling
async function makeRequest(method, endpoint, data = null) {
    try {
        const options = {
            method,
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(`${BASE_URL}${endpoint}`, options);
        const result = await response.json();

        console.log(`\n=== ${method} ${endpoint} ===`);
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(result, null, 2));

        return result;
    } catch (error) {
        console.error('Error:', error.message);
        return null;
    }
}

// Test functions
async function testGetProfile() {
    console.log('\n🔍 Testing GET Profile...');
    return await makeRequest('GET', '/auth/sso/profil');
}

async function testUpdateProfile() {
    console.log('\n✏️ Testing UPDATE Profile...');
    const updateData = {
        user_name: 'updated_username',
        user_email: 'updated@example.com'
    };
    return await makeRequest('PUT', '/auth/sso/profil', updateData);
}

async function testUpdatePassword() {
    console.log('\n🔐 Testing UPDATE Password...');
    const passwordData = {
        current_password: 'password123',
        new_password: 'NewPassword123',
        confirm_password: 'NewPassword123'
    };
    return await makeRequest('PUT', '/auth/sso/profil/password', passwordData);
}

async function testInvalidUpdateProfile() {
    console.log('\n❌ Testing INVALID UPDATE Profile (empty data)...');
    return await makeRequest('PUT', '/auth/sso/profil', {});
}

async function testInvalidPassword() {
    console.log('\n❌ Testing INVALID UPDATE Password (wrong current password)...');
    const invalidPasswordData = {
        current_password: 'wrong_password',
        new_password: 'NewPassword123',
        confirm_password: 'NewPassword123'
    };
    return await makeRequest('PUT', '/auth/sso/profil/password', invalidPasswordData);
}

// Main test function
async function runAllTests() {
    console.log('=== SSO Profile API Test Suite ===');
    
    if (!jwtToken) {
        console.error('❌ Error: JWT Token tidak disediakan!');
        console.log('Silakan login terlebih dahulu dan masukkan token JWT ke dalam variable jwtToken');
        console.log('\nContoh cara mendapatkan token:');
        console.log('1. Login melalui endpoint /api/auth/sso/login');
        console.log('2. Copy token dari response');
        console.log('3. Update variable jwtToken di script ini');
        return;
    }

    console.log(`Using JWT Token: ${jwtToken.substring(0, 20)}...`);

    // Run tests
    await testGetProfile();
    await testUpdateProfile();
    await testUpdatePassword();
    await testInvalidUpdateProfile();
    await testInvalidPassword();

    console.log('\n✅ Test suite completed!');
}

// Login function untuk mendapatkan token
async function loginAndGetToken() {
    console.log('\n🔑 Logging in to get JWT token...');
    
    const loginData = {
        email: 'admin@sso-testing.com', // Ganti dengan email yang valid
        password: 'admin123' // Ganti dengan password yang valid
    };

    try {
        const response = await fetch(`${BASE_URL}/auth/sso/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        const result = await response.json();
        
        if (result.success && result.data?.token) {
            jwtToken = result.data.token;
            console.log('✅ Login successful!');
            console.log(`Token: ${jwtToken.substring(0, 20)}...`);
            return true;
        } else {
            console.error('❌ Login failed:', result.message);
            return false;
        }
    } catch (error) {
        console.error('❌ Login error:', error.message);
        return false;
    }
}

// Auto-login dan run tests
async function main() {
    const loginSuccess = await loginAndGetToken();
    
    if (loginSuccess) {
        await runAllTests();
    } else {
        console.log('\n💡 Manual testing:');
        console.log('1. Update jwtToken variable dengan token yang valid');
        console.log('2. Run: runAllTests()');
    }
}

// Export functions untuk manual testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        makeRequest,
        testGetProfile,
        testUpdateProfile,
        testUpdatePassword,
        testInvalidUpdateProfile,
        testInvalidPassword,
        runAllTests,
        loginAndGetToken,
        main
    };
}

// Run main function jika script dijalankan langsung
if (typeof window === 'undefined') {
    main();
}
