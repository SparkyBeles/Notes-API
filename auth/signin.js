const { GetCommand } = require('@aws-sdk/lib-dynamodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { dynamodb } = require('../utils/dynamodb');
const { createResponse } = require('../utils/response');

module.exports.handler = async (event) => {
  try {
    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return createResponse(400, { message: 'Email and password are required' });
    }

    const result = await dynamodb.send(
      new GetCommand({
        TableName: 'users-table',
        Key: { email }
      })
    );

    if (!result.Item) {
      return createResponse(401, { message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, result.Item.password);

    if (!isValidPassword) {
      return createResponse(401, { message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: result.Item.userId },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return createResponse(200, { 
      success: true,
      message: 'Sign in successful', 
      token
    });

  } catch (error) {
    console.error('Signin error:', error);
    return createResponse(500, { message: 'Internal server error' });
  }
};
