const http = require('http');

const server = http.createServer((req, res) => {
  // data emit event
  req.on('data', (data) => { });

  // request end event
  req.on('end', () => {
    router.hello((statusCode, payload) => {
      // Convert the payload to a string
      let payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);
    })
  });
});


// Define a request router
let router = {
  hello: (callback) => {
    callback(200, { 'message': 'hello world' })
  }
};

// Start the server, and have it listen on port 3000
server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});