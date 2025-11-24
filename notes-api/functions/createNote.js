const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  try {
    const { title, content, userId } = JSON.parse(event.body);

    if (!title || !content) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Title and content are required' })
      };
    }

    const id = uuidv4();
    const timestamp = new Date().toISOString();

    const params = {
      TableName: 'notes-table',
      Item: {
        id,
        userId: userId || 'anonymous',
        title,
        content,
        createdAt: timestamp,
        updatedAt: timestamp
      }
    };

    await dynamodb.put(params).promise();

    return {
      statusCode: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params.Item)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
};
