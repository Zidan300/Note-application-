# SecureStay

SecureStay is a React notes/tasks portal backed by an Express REST API, MongoDB, Mongoose, and JWT authentication. Tasks are private to the authenticated account and all changes persist to MongoDB.

## Prerequisites

- Node.js 18+
- MongoDB 6+ locally or a MongoDB Atlas URI
- npm

## Setup

1. Copy `.env.example` to `.env` and set a long random `JWT_SECRET` and a working `MONGODB_URI`.
2. Install backend dependencies from the repository root: `npm install`.
3. Install frontend dependencies: `cd Note-UI && npm install`.
4. Optionally create `Note-UI/.env` with `VITE_API_BASE_URL=http://localhost:3000/api` (this is the default).

Never commit `.env`, credentials, or production secrets.

## Run

Start MongoDB, then in separate terminals:

```bash
npm run dev                 # backend on http://localhost:3000
cd Note-UI && npm run dev   # frontend on http://localhost:5173
```

The frontend also supports `npm run lint` and `npm run build`.

## Authentication and API

Authentication uses `Authorization: Bearer <jwt>`. Signup and login return a token and public user details. Every task endpoint independently verifies the token and scopes queries to its owner.

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/signup` | No | Create an account |
| POST | `/api/auth/login` | No | Authenticate |
| GET | `/api/tasks` | Yes | List tasks; optional `?completed=true/false` |
| POST | `/api/tasks` | Yes | Create a task |
| GET | `/api/tasks/:id` | Yes | Read one owned task |
| PUT | `/api/tasks/:id` | Yes | Update title, description, due date, or `isCompleted` |
| DELETE | `/api/tasks/:id` | Yes | Delete one owned task |

Successful task creation returns `201`, updates return `200`, and deletion returns `204`. Invalid input returns `400`; invalid/missing authentication returns `401`; missing owned resources return `404`.

## Security notes

Passwords are stored as bcrypt hashes, JWT secrets are environment-only, task routes are backend-protected, client input is validated on both sides, and the UI renders note content as text rather than unsafe HTML. The frontend route guard is only a usability layer; the API remains the security boundary.
