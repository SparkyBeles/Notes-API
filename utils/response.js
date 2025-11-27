const createResponse = (statusCode, data) => ({
  statusCode,
  headers: { 
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
});

module.exports = { createResponse };
