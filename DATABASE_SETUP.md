# Database Setup Guide

This guide explains how to set up MongoDB for the Collaborative To-Do List API.

## Option 1: Local MongoDB Installation

### macOS (Homebrew)

1. **Install MongoDB:**
   ```bash
   brew tap mongodb/brew
   brew install mongodb-community
   ```

2. **Start MongoDB:**
   ```bash
   brew services start mongodb-community
   ```

3. **Verify it is running:**
   ```bash
   mongosh --eval "db.runCommand({ping:1})"
   ```
   Expected output: `{ ok: 1 }`

4. **Stop MongoDB (when needed):**
   ```bash
   brew services stop mongodb-community
   ```

### Windows

1. Download MongoDB Community Edition from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Run the installer and follow the setup wizard
3. MongoDB should start automatically as a Windows service
4. Verify with: `mongosh --eval "db.runCommand({ping:1})"`

### Linux (Ubuntu/Debian)

1. **Import the public key:**
   ```bash
   wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
   ```

2. **Add the repository and install:**
   ```bash
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   ```

3. **Start MongoDB:**
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

## Option 2: MongoDB Atlas (Cloud)

MongoDB Atlas provides a free cloud-hosted database. No local installation required.

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free account
2. Create a new cluster (the free M0 tier is sufficient)
3. Under **Database Access**, create a database user with a username and password
4. Under **Network Access**, add your IP address (or use `0.0.0.0/0` for testing)
5. Click **Connect** on your cluster, then **Connect your application**
6. Copy the connection string
7. Replace `<password>` with your database user password

Your connection string will look like:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/todo_app?retryWrites=true&w=majority
```

## Configuring the Environment Variable

### Local MongoDB

Your `.env` file should contain:
```
MONGODB_URI=mongodb://127.0.0.1:27017/todo_app
```

### MongoDB Atlas

Your `.env` file should contain:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/todo_app?retryWrites=true&w=majority
```

**Important:** Never commit your `.env` file to version control. The `.gitignore` file already excludes it.

## Verifying the Database Connection

### Step 1: Start MongoDB

Make sure MongoDB is running (see above).

### Step 2: Start the API Server

```bash
npm start
```

If the connection is successful, you will see:
```
MongoDB connected successfully: 127.0.0.1
```

If the connection fails, you will see:
```
MongoDB connection error: <error message>
```

### Step 3: Test with curl

```bash
# Create a task
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test task","description":"Testing the connection"}'

# Get all tasks
curl http://localhost:3000/api/tasks
```

## Checking Persisted Documents

### Using mongosh

```bash
# Connect to the database
mongosh todo_app

# List all tasks
db.tasks.find().pretty()

# Count tasks
db.tasks.countDocuments()

# Find a specific task
db.tasks.findOne({title: "Test task"})

# Find completed tasks
db.tasks.find({isCompleted: true})

# Drop the collection (delete all tasks)
db.tasks.drop()
```

### Using the API

```bash
# Get all tasks (returns count and data)
curl http://localhost:3000/api/tasks

# Get only completed tasks
curl "http://localhost:3000/api/tasks?completed=true"

# Get a specific task by ID
curl http://localhost:3000/api/tasks/<task-id>
```

## Database Schema

The `tasks` collection has the following structure:

```json
{
  "_id": ObjectId("..."),
  "title": "String (required, max 100 chars)",
  "description": "String (optional)",
  "isCompleted": "Boolean (default: false)",
  "dueDate": "Date (optional)",
  "createdAt": "Date (auto-generated)",
  "updatedAt": "Date (auto-generated)",
  "__v": "Number (version key)"
}
```

## Troubleshooting

### "MongoDB connection error: connect ECONNREFUSED"

MongoDB is not running. Start it with:
```bash
brew services start mongodb-community   # macOS
sudo systemctl start mongod             # Linux
```

### "MongoDB connection error: querySrv ECONNREFUSED"

Check your internet connection if using Atlas, or verify the connection string.

### Port 5000 already in use (macOS)

macOS uses port 5000 for AirPlay/ControlCenter. Change `PORT` in your `.env` file to `3000`:
```
PORT=3000
```
