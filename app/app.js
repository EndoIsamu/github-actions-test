const http = require('http');
 
const hostname = '0.0.0.0';
const port = 8080;
 
const server = http.createServer((req, res) => {
  // console.log(req.headers)
  // console.log(`request from: ${req.headers['x-forwarded-for'] || req.socket.remoteAddress}`)

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World!!!!');
});
 
server.listen(port, hostname, () => {
 console.log(`Server running at http://${hostname}:${port}/`);
});
