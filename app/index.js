/*
 * Primary file for the API
 * 
 */

// Dependencies
const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');
const config = require('./config');
const handlers = require('./handlers');
const router = require('./router');

// Instantiate the HTTP server
const server = http.createServer((req, res) => {
  // Get the URL and parse it
  const parsedUrl = url.parse(req.url, true);

  // Get the path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object
  const queryStringObject = parsedUrl.query;

  // Get the HTTP Method
  const method = req.method.toLowerCase();

  // Get the headers as an object
  const headers = req.headers;

  // Get the payload, if any
  const decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', (data) => {
    buffer += decoder.write(data);
  });
  req.on('end', () => {
    buffer += decoder.end();

    // Choose the handler this request should go to. If one is not found, use the notFound handler
    const chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    // Construct the data object to send the handler
    const data = {
      'trimmedPath': trimmedPath,
      'queryStringObject': queryStringObject,
      'method': method,
      'headers': headers,
      'payload': buffer
    };

    // Route the request to the handler specified in the router
    chosenHandler(data, (statusCode, payload) => {

      // Use the status code called back by the handler, or default ot 200
      statusCode = typeof (statusCode) == 'number' ? statusCode : 200;

      // Use the payload called back by the handler, or default ot an empty object
      payload = typeof (payload) == 'object' ? payload : {};

      // Convert the payload to a string
      const payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

      // Log the request path
      console.log('Returning this response: ', statusCode, payloadString);

    });
  });
});

// Start the server, and have it listen on port 3000
server.listen(config.httpPort, () => {
  console.log(`Server is listening on port ${config.httpPort}`);
});