const axios = require('axios');
async function test() {
  try {
    const login = await axios.post('http://localhost:5000/api/auth/admin/login', {
      email: 'admin',
      password: 'admin'
    });
    const token = login.data.token;
    const res = await axios.get('http://localhost:5000/api/admin/patients', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
}
test();
