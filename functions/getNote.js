const { GetCommand } = require('@aws-sdk/lib-dynamodb');
const middy = require('@middy/core');
const httpErrorHandler = require('@middy/http-error-handler');
const { validateAuth } = require('../middleware/auth');
const { dynamodb } = require('../utils/dynamodb');
const { createResponse } = require('../utils/response');

const getNote = async (event) => {
  try {
    const { id } = event.pathParameters;

    const result = await dynamodb.send(
      new GetCommand({
        TableName: 'notes-table',
        Key: { id }
      })
    );

    if (!result.Item) {
      return createResponse(404, { message: 'Note not found' });
    }

    if (result.Item.userId !== event.userId) {
      return createResponse(403, { message: 'Access denied' });
    }

    return createResponse(200, { 
      success: true,
      note: result.Item
    });

  } catch (error) {
    console.error('Get note error:', error);
    return createResponse(500, { message: 'Failed to retrieve note' });
  }
};

module.exports.handler = middy(getNote)
  .use(validateAuth)
  .use(httpErrorHandler());
