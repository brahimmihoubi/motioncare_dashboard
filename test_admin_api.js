const axios = require('axios');
async function test() {
  const login = await axios.post('http://localhost:5000/api/auth/admin/login', {
    email: 'admin',
    password: 'admin'
  });
  const token = login.data.token;
  const res = await axios.get('http://localhost:5000/api/admin/patients', {
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log(JSON.stringify(res.data, null, 2));
}
test();
