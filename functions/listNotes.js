const { QueryCommand } = require('@aws-sdk/lib-dynamodb');
const middy = require('@middy/core');
const httpErrorHandler = require('@middy/http-error-handler');
const { validateAuth } = require('../middleware/auth');
const { dynamodb } = require('../utils/dynamodb');
const { createResponse } = require('../utils/response');

const listNotes = async (event) => {
  try {
    const result = await dynamodb.send(
      new QueryCommand({
        TableName: 'notes-table',
        IndexName: 'userId-index',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': event.userId
        }
      })
    );

    return createResponse(200, { 
      success: true,
      notes: result.Items || []
    });

  } catch (error) {
    console.error('List notes error:', error);
    return createResponse(500, { message: 'Failed to retrieve notes' });
  }
};

module.exports.handler = middy(listNotes)
  .use(validateAuth)
  .use(httpErrorHandler());
