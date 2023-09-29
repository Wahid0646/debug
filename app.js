const http = require('http');
const fs = require('fs');

function createServer() {
  const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;
    const body = [];
  
    if (url === '/') {
      fs.readFile('message.txt', { encoding: "utf-8" }, (err, data) => {
        if (err) {
          console.error(err);
        }
  
        console.log('data from file: ' + data);
  
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>Enter Message</title></head>');
        res.write(`<body>${data}</body>`);
        res.write(
          '<body><form action="/message" method="POST"><input type="text" name="message" /><button type="submit">Send</button></form></body>'
        );
        res.write('</html>');
        return res.end();
      });
    } else if (url === '/message' && method === 'POST') {
      req.on('data', (chunk) => {
        body.push(chunk);
      });
  
      return req.on('end', () => {
        const parsedBody = Buffer.concat(body).toString();
        console.log('parsedbody>>>>>', parsedBody);
  
        const message = parsedBody.split('=')[1];
  
        fs.writeFile('message.txt', message + '\n', (err) => {
          if (err) {
            console.error(err);
          }
          console.log('inside fs.writeFile');
          res.statusCode = 302;
          res.setHeader('Location', '/');
          return res.end();
        });
      });
    } else {
      res.setHeader('Content-Type', 'text/html');
      res.write('<html>');
      res.write('<head><title>My First Page</title></head>');
      res.write('<body><h1>Hello from my Node.js Server!</h1></body>');
      res.write('</html>');
      res.end();
    }
  });

  server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });

  return server;
}

module.exports = createServer;
