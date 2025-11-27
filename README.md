# Notes API

A serverless REST API built with AWS Lambda,Middy, DynamoDB and Serverless Framework.

## Project Structure

```
notes-api/
├── auth/                  # Authentication handlers
│   ├── signin.js          # User sign in with JWT generation
│   └── signup.js          # User registration with password hashing
├── functions/             # Notes CRUD operations (auth required)
│   ├── createNote.js      # Create new note
│   ├── getNote.js         # Retrieve single note
│   ├── listNotes.js       # List all user notes
│   ├── updateNote.js      # Update existing note
│   └── deleteNote.js      # Delete note
├── middleware/            # Custom middleware
│   └── auth.js            # JWT validation middleware
├── utils/                 # Utility modules
│   ├── dynamodb.js        # DynamoDB client configuration
│   └── response.js        # HTTP response helper
├── .env                   # Environment configuration
├── serverless.yml         # Serverless deployment config
└── package.json           # Dependencies
```



## API Endpoints

### Authentication (Public)

#### Sign Up

- **POST** `/auth/signup`
- **Body:**
  ```json
  {
    "email": "test@test.com",
    "password": "yourpassword"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "User created successfully",
    "userId": "uuid"
  }
  ```

#### Sign In

- **POST** `/auth/signin`
- **Body:**
  ```json
  {
    "email": "test@test.com",
    "password": "yourpassword"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Sign in successful",
    "token": "jwt-token-here"
  }
  ```


#### Create Note

- **POST** `/notes`
- **Body:**
  ```json
  {
    "title": "My Note",
    "content": "Note content here"
  }
  ```

#### List Notes

- **GET** `/notes`
- Returns only notes belonging to the authenticated user

#### Get Note

- **GET** `/notes/{id}`
- Returns note only if it belongs to the authenticated user

#### Update Note

- **PUT** `/notes/{id}`
- **Body:**
  ```json
  {
    "title": "Updated Title",
    "content": "Updated content"
  }
  ```


#### Delete Note

- **DELETE** `/notes/{id}`

