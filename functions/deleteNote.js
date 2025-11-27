const { GetCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const middy = require('@middy/core');
const httpErrorHandler = require('@middy/http-error-handler');
const { validateAuth } = require('../middleware/auth');
const { dynamodb } = require('../utils/dynamodb');
const { createResponse } = require('../utils/response');

const deleteNote = async (event) => {
  try {
    const { id } = event.pathParameters;

    const existingNote = await dynamodb.send(
      new GetCommand({
        TableName: 'notes-table',
        Key: { id }
      })
    );

    if (!existingNote.Item) {
      return createResponse(404, { message: 'Note not found' });
    }

    if (existingNote.Item.userId !== event.userId) {
      return createResponse(403, { message: 'Access denied' });
    }

    await dynamodb.send(
      new DeleteCommand({
        TableName: 'notes-table',
        Key: { id }
      })
    );

    return createResponse(200, { 
      success: true,
      message: 'Note deleted successfully'
    });

  } catch (error) {
    console.error('Delete note error:', error);
    return createResponse(500, { message: 'Failed to delete note' });
  }
};

module.exports.handler = middy(deleteNote)
  .use(validateAuth)
  .use(httpErrorHandler());
