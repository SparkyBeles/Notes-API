# Notes API

A serverless REST API built with AWS Lambda,Middy, DynamoDB and Serverless Framework.

## API Docs
https://documenter.getpostman.com/view/49734789/2sB3dLSrAq

## Project Structure

```
notes-api/
├── auth/                  # Authentication handlers
│   ├── signin.js          # User sign in with JWT generation
│   └── signup.js          # User registration with password hashing
├── functions/             # Notes CRUD operations (auth required)
│   ├── createNote.js      # Create new note
│   ├── deleteNote.js      # Delete note
│   ├── getNote.js         # Retrieve single note
│   ├── listNote.js        # List all user notes
│   └── updateNote.js      # Update existing note
├── middleware/            # Custom middleware
│   └── auth.js            # JWT validation middleware
├── utils/                 # Utility modules
│   ├── dynamodb.js        # DynamoDB client configuration
│   └── response.js        # HTTP response helper
├── .env                   # aws & jws secrets
├── .gitignore
├──  Postman config        
├── README.md              
├── package-lock.json      # Dependencies
├── package.json           # Dependencies
└── serverless.ymlv        # Serverless deployment config
```



## API Endpoints

### Authentication 

#### Sign Up

- **POST** `https://8y8ws5zxf0.execute-api.eu-north-1.amazonaws.com/auth/signup`
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

- **POST** `https://8y8ws5zxf0.execute-api.eu-north-1.amazonaws.com/auth/signin`
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

- **POST** `https://8y8ws5zxf0.execute-api.eu-north-1.amazonaws.com/notes`
- **Body:**
  ```json
  {
    "title": "My Note",
    "content": "Note content here"
  }
  ```

#### List Notes

- **GET** `https://8y8ws5zxf0.execute-api.eu-north-1.amazonaws.com/notes`
- Returns only notes belonging to the authenticated user

#### Get Note

- **GET** `https://8y8ws5zxf0.execute-api.eu-north-1.amazonaws.com/notes/{id}`
- Returns note only if it belongs to the authenticated user

#### Update Note

- **PUT** `https://8y8ws5zxf0.execute-api.eu-north-1.amazonaws.com/notes/{id}`
- **Body:**
  ```json
  {
    "title": "Updated Title",
    "content": "Updated content"
  }
  ```


#### Delete Note

- **DELETE** `https://8y8ws5zxf0.execute-api.eu-north-1.amazonaws.com/notes/{id}`

