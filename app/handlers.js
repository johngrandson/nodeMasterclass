// Define the handlers
handlers = {};

// Hello handler
handlers.hello = (data, callback) => {
  callback(200, { 'res': 'Hello World' });
}

// Not found handler
handlers.notFound = (data, callback) => {
  callback(404, { 'res': 'Not Found' });
};

// Export the module
module.exports = handlers;