async function testAuth() {
  try {
    console.log('Testing Signup...');
    const signupRes = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'password123'
      })
    });
    const signupData = await signupRes.json();
    console.log('Signup Success:', signupData);

    console.log('\nTesting Login...');
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: signupData.email,
        password: 'password123'
      })
    });
    const loginData = await loginRes.json();
    console.log('Login Success:', loginData);
  } catch (error) {
    console.error('Test Failed:', error.message);
  }
}

testAuth();
