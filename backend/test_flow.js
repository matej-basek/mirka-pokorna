const axios = require('axios');
async function test() {
  try {
    const login = await axios.post('http://localhost:5000/api/auth/login', { username: 'admin', password: 'admin123' });
    const token = login.data.token;
    console.log('Token:', token);
    const reviews = await axios.get('http://localhost:5000/api/reviews/all', {
      headers: { Authorization: 'Bearer ' + token }
    });
    console.log('Reviews count:', reviews.data.length);
  } catch (e) {
    console.log('Error:', e.message);
  }
}
test();
