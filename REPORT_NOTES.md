# Report Notes — Collaborative To-Do List REST API

> This document contains factual information for creating the university report.
> All data below was gathered from actual testing performed on 17 August 2026.

---

## Project Objective

Build a RESTful API for a Collaborative To-Do List application using Node.js, Express.js, MongoDB, and Mongoose. The API supports full CRUD operations with input validation, error handling, and data persistence.

## Technologies Used

| Technology | Version | Purpose |
|---|---|---|
| Node.js | v26.6.0 | JavaScript runtime |
| Express.js | 4.21.2 | Web framework for HTTP routing |
| MongoDB | 8.3.7 | NoSQL document database |
| Mongoose | 8.9.5 | ODM for schema definition and validation |
| dotenv | 16.4.7 | Environment variable loading |
| cors | 2.8.5 | Cross-origin request handling |
| nodemon | 3.1.9 | Development auto-restart |

## Architecture

- **Modular structure** with separation of concerns
- **MVC-inspired pattern**: Models (schema), Controllers (logic), Routes (endpoints)
- **Centralized error handling** via Express middleware
- **Environment-based configuration** using dotenv

## Database Schema

**Collection:** `tasks`

| Field | Type | Constraints | Default |
|---|---|---|---|
| `_id` | ObjectId | Auto-generated | — |
| `title` | String | Required, trimmed, max 100 chars | — |
| `description` | String | Trimmed | `""` |
| `isCompleted` | Boolean | — | `false` |
| `dueDate` | Date | — | `null` |
| `createdAt` | Date | Auto-generated (timestamps) | — |
| `updatedAt` | Date | Auto-updated (timestamps) | — |

## Endpoint Table

| # | Method | Endpoint | Description | Input | Success | Error Codes |
|---|---|---|---|---|---|---|
| 1 | POST | /api/tasks | Create task | title (required), description, isCompleted, dueDate | 201 | 400 |
| 2 | GET | /api/tasks | List all tasks | — | 200 | — |
| 3 | GET | /api/tasks?completed=true | Filter completed | completed=true/false | 200 | 400 |
| 4 | GET | /api/tasks/:id | Get one task | id (ObjectId) | 200 | 400, 404 |
| 5 | PUT | /api/tasks/:id | Update task | title, description, isCompleted, dueDate | 200 | 400, 404 |
| 6 | DELETE | /api/tasks/:id | Delete task | id (ObjectId) | 204 | 400, 404 |

## Validation Rules

- Title is required for creation
- Title must not exceed 100 characters
- Title is trimmed (whitespace removed from edges)
- Empty or null title on update is rejected
- Empty update body is rejected
- `completed` query parameter must be `"true"` or `"false"` exactly
- ObjectId parameters must be valid 24-character hex strings

## HTTP Status Codes Used

| Code | Meaning | When Used |
|---|---|---|
| 200 | OK | Successful GET, PUT |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation error, invalid ID, invalid query |
| 404 | Not Found | Task not found, unknown route |
| 500 | Internal Server Error | Unexpected errors |

## Error Handling

All errors return a consistent JSON format:
```json
{ "success": false, "message": "Description of the error" }
```

Types handled:
- Mongoose `ValidationError` → 400
- Mongoose `CastError` (invalid ObjectId) → 400
- Document not found → 404
- Unknown routes → 404 (via notFound middleware)
- Unexpected errors → 500 (via errorHandler middleware)

Stack traces and database credentials are never exposed to the client.

## Testing Performed

### Manual API Testing (curl)

All 20+ test cases were executed against the running server with MongoDB connected.

| Test | Endpoint | Input | Expected | Actual | Result |
|---|---|---|---|---|---|
| Create valid task | POST /api/tasks | Valid body | 201 | 201 | PASS |
| Create missing title | POST /api/tasks | No title | 400 | 400 | PASS |
| Create title >100 chars | POST /api/tasks | 101-char title | 400 | 400 | PASS |
| Create empty body | POST /api/tasks | {} | 400 | 400 | PASS |
| Get all tasks | GET /api/tasks | — | 200, array | 200, array | PASS |
| Get completed tasks | GET /api/tasks?completed=true | — | 200, filtered | 200, filtered | PASS |
| Get incomplete tasks | GET /api/tasks?completed=false | — | 200, filtered | 200, filtered | PASS |
| Get invalid completed query | GET /api/tasks?completed=invalid | — | 400 | 400 | PASS |
| Get task by ID | GET /api/tasks/:id | Valid ID | 200 | 200 | PASS |
| Get nonexistent task | GET /api/tasks/:id | Valid but absent ID | 404 | 404 | PASS |
| Get invalid ID | GET /api/tasks/:id | "notavalidid" | 400 | 400 | PASS |
| Update task | PUT /api/tasks/:id | Updated fields | 200 | 200 | PASS |
| Update with empty title | PUT /api/tasks/:id | title: "" | 400 | 400 | PASS |
| Update nonexistent | PUT /api/tasks/:id | Absent ID | 404 | 404 | PASS |
| Update invalid ID | PUT /api/tasks/:id | "invalid" | 400 | 400 | PASS |
| Update empty body | PUT /api/tasks/:id | {} | 400 | 400 | PASS |
| Delete task | DELETE /api/tasks/:id | Valid ID | 204 | 204 | PASS |
| Verify deletion | GET /api/tasks/:id | Deleted ID | 404 | 404 | PASS |
| Delete nonexistent | DELETE /api/tasks/:id | Absent ID | 404 | 404 | PASS |
| Delete invalid ID | DELETE /api/tasks/:id | "invalid" | 400 | 400 | PASS |
| Unknown route | GET /api/unknown | — | 404 | 404 | PASS |

### Database Persistence Verification

- Created tasks via API → confirmed documents exist in MongoDB via `mongosh`
- Verified `createdAt` and `updatedAt` timestamps are present and correct
- Updated tasks via API → confirmed changes reflected in MongoDB
- Deleted tasks via API → confirmed document count decreases in MongoDB
- All operations verified both through API responses and direct MongoDB queries

## Bug Fixed During Testing

**Issue:** PUT request with missing title field returned 200 instead of 400.
**Cause:** Mongoose `runValidators: true` does not enforce `required` validators on fields omitted from the update payload.
**Fix:** Added explicit validation in the `updateTask` controller to check for empty/null title and empty update body before calling `findByIdAndUpdate`.

## Recommended Screenshots

1. **Terminal — Server startup** showing MongoDB connected message and port
2. **Terminal — POST create** showing curl command and 201 response with full task object
3. **Terminal — POST validation** showing 400 error for missing title
4. **Terminal — GET all** showing array of tasks with count
5. **Terminal — GET filter** showing `?completed=true` returning only completed tasks
6. **Terminal — GET by ID** showing single task retrieval
7. **Terminal — PUT update** showing updated task with changed fields
8. **Terminal — DELETE** showing 204 status code
9. **Terminal — Verify deletion** showing 404 after DELETE
10. **mongosh — Database documents** showing tasks stored in MongoDB with timestamps
11. **Postman — Collection** showing imported requests in the sidebar
12. **VS Code — Project structure** showing the `src/` folder layout

## Recommended Video Demonstration Sequence (3–5 minutes)

1. **[0:00–0:30] Project overview**: Show project structure in VS Code, explain the modular architecture
2. **[0:30–1:00] Server startup**: Start the server in terminal, show MongoDB connection message
3. **[1:00–1:45] Create tasks**: Use curl to create 2–3 tasks, show 201 responses with all fields
4. **[1:45–2:15] Validation demo**: Show missing title (400), title too long (400), invalid query (400)
5. **[2:15–2:45] Read tasks**: Show GET all, GET with filter, GET by ID, GET nonexistent (404)
6. **[2:45–3:15] Update task**: Show PUT with all fields changed, verify with GET
7. **[3:15–3:30] Delete task**: Show DELETE (204), then GET the same ID (404)
8. **[3:30–4:00] Database persistence**: Open mongosh, show documents with timestamps, run update, show change
9. **[4:00–4:30] Postman demo**: Show imported collection, run a request, show test assertions passing
10. **[4:30–5:00] Summary**: Brief recap of features, error handling, and architecture decisions
