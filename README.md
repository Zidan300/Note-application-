# Collaborative To-Do List REST API

A RESTful API for managing tasks, built with Node.js, Express.js, MongoDB, and Mongoose as part of a university assignment.

## Project Overview

This API provides a complete CRUD (Create, Read, Update, Delete) interface for managing to-do tasks. It supports task creation with validation, filtering by completion status, full update operations, and deletion with proper error handling throughout.

## Features

- Create tasks with title, description, completion status, and due date
- Retrieve all tasks or filter by completion status
- Retrieve individual tasks by their unique MongoDB ObjectId
- Update existing tasks with full validation
- Delete tasks with confirmation
- Centralized error handling with consistent JSON responses
- Mongoose schema validation with custom error messages
- Automatic timestamps (createdAt, updatedAt)

## Technology Stack

| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime environment |
| **Express.js** | Web framework for routing and middleware |
| **MongoDB** | NoSQL document database |
| **Mongoose** | ODM library for MongoDB schema and validation |
| **dotenv** | Environment variable management |
| **nodemon** | Auto-restart development server |

## Architecture

The project follows a modular MVC-inspired architecture:

- **Models** define the data schema and validation rules
- **Controllers** contain the business logic for each operation
- **Routes** map HTTP methods and paths to controller functions
- **Middleware** handles errors and unknown routes
- **Config** manages database connection

## Project Structure

```
note-appliication/
├── .env                  # Environment variables (not committed)
├── .gitignore            # Git ignore rules
├── package.json          # Dependencies and scripts
├── index.js              # Entry point - starts server
├── config/
│   └── db.js             # MongoDB connection
├── controllers/
│   └── taskController.js # Business logic for tasks
├── middleware/
│   ├── errorHandler.js   # Global error handler
│   └── notFound.js       # 404 middleware
├── models/
│   └── Task.js           # Mongoose schema
├── routes/
│   └── taskRoutes.js     # API route definitions
├── postman/
│   └── Collaborative-Todo-API.postman_collection.json
└── README.md
```

## Prerequisites

- **Node.js** v18 or higher
- **MongoDB** v6 or higher (local installation or MongoDB Atlas)
- **npm** (comes with Node.js)
- Optionally: **Postman** for API testing

## Installation

1. Clone or download the project files
2. Navigate to the project directory:
   ```bash
   cd note-appliication
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the project root (see Environment Variables below)

## Environment Variables

Create a `.env` file in the project root:

```
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/todo_app
NODE_ENV=development
```

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | Server listening port |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/todo_app` | MongoDB connection string |
| `NODE_ENV` | `development` | Environment mode |

**Note:** The `.env` file is listed in `.gitignore` and will not be committed to Git.

## MongoDB Setup

### Local Installation

1. Install MongoDB Community Edition from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start the MongoDB service:
   ```bash
   # macOS with Homebrew
   brew services start mongodb-community

   # Linux
   sudo systemctl start mongod
   ```
3. Verify MongoDB is running:
   ```bash
   mongosh --eval "db.runCommand({ping:1})"
   ```

### MongoDB Atlas (Cloud Alternative)

1. Create a free account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a cluster and get your connection string
3. Set `MONGODB_URI` in your `.env` file to the Atlas connection string

## Running the Server

### Development mode (auto-restart on changes):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

### Successful startup messages:
```
MongoDB connected successfully
Server running on port 3000
```

## API Endpoints

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `POST` | `/api/tasks` | Create a new task | 201, 400 |
| `GET` | `/api/tasks` | Get all tasks | 200 |
| `GET` | `/api/tasks?completed=true` | Get completed tasks | 200 |
| `GET` | `/api/tasks?completed=false` | Get incomplete tasks | 200 |
| `GET` | `/api/tasks/:id` | Get task by ID | 200, 400, 404 |
| `PUT` | `/api/tasks/:id` | Update a task | 200, 400, 404 |
| `DELETE` | `/api/tasks/:id` | Delete a task | 204, 400, 404 |

## Request Examples

### Create a Task
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete assignment",
    "description": "Finish REST API project",
    "isCompleted": false,
    "dueDate": "2026-08-30T18:00:00.000Z"
  }'
```

### Get All Tasks
```bash
curl http://localhost:3000/api/tasks
```

### Get Completed Tasks
```bash
curl "http://localhost:3000/api/tasks?completed=true"
```

### Get Task by ID
```bash
curl http://localhost:3000/api/tasks/64f1a2b3c4d5e6f7a8b9c0d1
```

### Update a Task
```bash
curl -X PUT http://localhost:3000/api/tasks/64f1a2b3c4d5e6f7a8b9c0d1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated title",
    "isCompleted": true
  }'
```

### Delete a Task
```bash
curl -X DELETE http://localhost:3000/api/tasks/64f1a2b3c4d5e6f7a8b9c0d1
```

## Response Examples

### Successful Creation (201)
```json
{
  "success": true,
  "data": {
    "title": "Complete assignment",
    "description": "Finish REST API project",
    "isCompleted": false,
    "dueDate": "2026-08-30T18:00:00.000Z",
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "createdAt": "2026-08-17T10:00:00.000Z",
    "updatedAt": "2026-08-17T10:00:00.000Z",
    "__v": 0
  }
}
```

### Get All Tasks (200)
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "...",
      "title": "Task 1",
      "description": "...",
      "isCompleted": false,
      "dueDate": null,
      "createdAt": "...",
      "updatedAt": "...",
      "__v": 0
    }
  ]
}
```

### Validation Error (400)
```json
{
  "success": false,
  "message": "Title is required"
}
```

### Task Not Found (404)
```json
{
  "success": false,
  "message": "Task not found"
}
```

### Internal Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## HTTP Status Codes

| Code | Meaning | When Used |
|---|---|---|
| `200` | OK | Successful GET or PUT |
| `201` | Created | Successful POST |
| `204` | No Content | Successful DELETE |
| `400` | Bad Request | Validation error, invalid ID |
| `404` | Not Found | Task not found, unknown route |
| `500` | Internal Server Error | Unexpected server errors |

## Validation

- **title**: Required, trimmed, maximum 100 characters
- **description**: Optional, trimmed
- **isCompleted**: Boolean, defaults to `false`
- **dueDate**: Date, optional
- **completed query**: Must be `"true"` or `"false"` (case-sensitive)
- **ObjectId params**: Must be valid 24-character hex string
- **Empty updates**: Rejected with 400 error

## Error Handling

All errors return a consistent JSON structure:

```json
{
  "success": false,
  "message": "Human-readable error description"
}
```

Error types handled:
- Mongoose validation errors (400)
- Invalid ObjectId / CastError (400)
- Nonexistent resources (404)
- Unknown routes (404)
- Unexpected server errors (500) - no stack traces exposed

## Postman Testing

### Import the Collection

1. Open Postman
2. Click **Import** (top left)
3. Select `postman/Collaborative-Todo-API.postman_collection.json`
4. The collection includes requests covering all endpoints and error cases

### Collection Variables

| Variable | Description |
|---|---|
| `baseUrl` | Set to `http://localhost:3000/api` |
| `taskId` | Auto-set when running "Create Task" |

### Run in Order

1. Run **Create Task** first (sets `taskId` variable automatically)
2. Run other requests in any order
3. Run **Delete Task** last

Each request includes test assertions for expected status codes and response structure.

## Database Persistence

All tasks are stored in MongoDB and persist across server restarts. Verified by:

- Creating tasks via API and confirming they appear in direct MongoDB queries
- Updating tasks via API and confirming changes in MongoDB
- Deleting tasks via API and confirming removal from MongoDB
- Timestamps (`createdAt`, `updatedAt`) are automatically managed by Mongoose

## License

ISC
