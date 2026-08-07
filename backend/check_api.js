const http = require('http');
http.get('http://localhost:5000/api/reviews', (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => console.log('Reviews from API:', data));
});
http.get('http://localhost:5000/api/studios', (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => console.log('Studios from API:', data));
});
