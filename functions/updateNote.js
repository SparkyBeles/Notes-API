const { GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const middy = require('@middy/core');
const httpErrorHandler = require('@middy/http-error-handler');
const { validateAuth } = require('../middleware/auth');
const { dynamodb } = require('../utils/dynamodb');
const { createResponse } = require('../utils/response');

const updateNote = async (event) => {
  try {
    const { id } = event.pathParameters;
    const { title, content } = JSON.parse(event.body);

    if (!title && !content) {
      return createResponse(400, { message: 'Title or content required' });
    }

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

    const updateExpressions = [];
    const expressionAttributeValues = {};

    if (title) {
      updateExpressions.push('title = :title');
      expressionAttributeValues[':title'] = title;
    }
    if (content) {
      updateExpressions.push('content = :content');
      expressionAttributeValues[':content'] = content;
    }

    updateExpressions.push('updatedAt = :updatedAt');
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const result = await dynamodb.send(
      new UpdateCommand({
        TableName: 'notes-table',
        Key: { id },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW'
      })
    );

    return createResponse(200, { 
      success: true,
      note: result.Attributes
    });

  } catch (error) {
    console.error('Update note error:', error);
    return createResponse(500, { message: 'Failed to update note' });
  }
};

module.exports.handler = middy(updateNote)
  .use(validateAuth)
  .use(httpErrorHandler());
