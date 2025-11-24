# Notes API

A simple serverless REST API for managing notes with authentication, built using AWS Lambda, DynamoDB, and Serverless Framework.

## Project Structure

```
notes-api/
├── auth/                  # Authentication functions
│   ├── signin.js          # Sign in handler
│   └── signup.js          # Sign up handler
├── functions/             # Notes CRUD functions
│   ├── createNote.js      # Create a new note
│   ├── getNote.js         # Get a single note
│   ├── listNotes.js       # List all notes
│   ├── updateNote.js      # Update a note
│   └── deleteNote.js      # Delete a note
├── .env                   # Environment variables (AWS credentials)
├── serverless.yml         # Serverless Framework configuration
└── package.json           # Node.js dependencies
```

## API Endpoints

### Authentication

- `POST /auth/signup` - Create new user account
- `POST /auth/signin` - Sign in user

### Notes

- `POST /notes` - Create a new note
- `GET /notes` - List all notes
- `GET /notes/{id}` - Get a specific note
- `PUT /notes/{id}` - Update a note
- `DELETE /notes/{id}` - Delete a note

### Table

- `NOTES_TABLE` - DynamoDB table name for notes
- `USERS_TABLE` - DynamoDB table name for users
