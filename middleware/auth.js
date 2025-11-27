const jwt = require('jsonwebtoken');
const { createResponse } = require('../utils/response');

const validateAuth = {
  before: async (request) => {
    try {
      const authHeader = request.event.headers.authorization || request.event.headers.Authorization;

      if (!authHeader) {
        return createResponse(401, { error: 'Authorization header missing' });
      }

      const token = authHeader.replace('Bearer ', '');

      if (!token) {
        return createResponse(401, { error: 'Token missing' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      request.event.userId = decoded.userId;

    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return createResponse(401, { error: 'Token expired' });
      }
      return createResponse(401, { error: 'Invalid token' });
    }
  },

  onError: async (request) => {
    return createResponse(500, { error: 'Internal server error' });
  }
};

module.exports = { validateAuth };