const { PutCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');
const middy = require('@middy/core');
const httpErrorHandler = require('@middy/http-error-handler');
const { validateAuth } = require('../middleware/auth');
const { dynamodb } = require('../utils/dynamodb');
const { createResponse } = require('../utils/response');

const createNote = async (event) => {
  try {
    const { title, content } = JSON.parse(event.body);

    if (!title || !content) {
      return createResponse(400, { message: 'Title and content are required' });
    }

    const noteId = uuidv4();
    const timestamp = new Date().toISOString();

    const noteItem = {
      id: noteId,
      userId: event.userId,
      title,
      content,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    await dynamodb.send(
      new PutCommand({
        TableName: 'notes-table',
        Item: noteItem
      })
    );

    return createResponse(201, { 
      success: true,
      note: noteItem
    });

  } catch (error) {
    console.error('Create note error:', error);
    return createResponse(500, { message: 'Failed to create note' });
  }
};

module.exports.handler = middy(createNote)
  .use(validateAuth)
  .use(httpErrorHandler());
