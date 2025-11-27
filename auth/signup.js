const { PutCommand } = require('@aws-sdk/lib-dynamodb');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { dynamodb } = require('../utils/dynamodb');
const { createResponse } = require('../utils/response');

module.exports.handler = async (event) => {
  try {
    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return createResponse(400, { message: 'Email and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    await dynamodb.send(
      new PutCommand({
        TableName: 'users-table',
        Item: {
          email,
          userId,
          password: hashedPassword,
          createdAt: new Date().toISOString()
        },
        ConditionExpression: 'attribute_not_exists(email)'
      })
    );

    return createResponse(201, { 
      success: true,
      message: 'User created successfully', 
      userId 
    });

  } catch (error) {
    if (error.name === 'ConditionalCheckFailedException') {
      return createResponse(400, { message: 'User already exists' });
    }

    console.error('Signup error:', error);
    return createResponse(500, { message: 'Internal server error' });
  }
};
