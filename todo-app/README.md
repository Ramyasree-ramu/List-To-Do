# TASKR – Full-Stack Task Manager

A complete To-Do application with a React frontend and Node.js/Express REST API backend.

---

## Project Structure

```
todo-app/

├── backend/
│   ├── server.js        ← Express REST API (port 5000)
│   └── package.json
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── index.js     ← React entry point
    │   ├── App.js       ← Main component
    │   ├── App.css      ← Styles
    │   └── api.js       ← API service layer (fetch calls)
    └── package.json
```

---

## Setup & Run

### 1. Start the Backend

```bash
cd backend
npm install
npm start
# Server runs at http://localhost:5000
```

### 2. Start the Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm start
# App runs at http://localhost:3000
```

The frontend's `"proxy": "http://localhost:5000"` in `package.json` forwards all `/api/*` calls to the backend automatically.

---

## REST API Reference

| Method | Endpoint          | Description              | Body                     |
|--------|-------------------|--------------------------|--------------------------|
| GET    | `/api/tasks`      | Get all tasks            | –                        |
| GET    | `/api/tasks/:id`  | Get a single task        | –                        |
| POST   | `/api/tasks`      | Create a task            | `{ "title": "..." }`     |
| PUT    | `/api/tasks/:id`  | Update title/completed   | `{ "completed": true }`  |
| DELETE | `/api/tasks/:id`  | Delete a single task     | –                        |
| DELETE | `/api/tasks`      | Clear all completed      | –                        |

### Example with curl

```bash
# Create
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries"}'

# Get all
curl http://localhost:5000/api/tasks

# Toggle complete (replace ID)
curl -X PUT http://localhost:5000/api/tasks/<id> \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# Delete
curl -X DELETE http://localhost:5000/api/tasks/<id>
```

---

## Features

- **Add** tasks via the input bar
- **View** all, active, or completed tasks (filter tabs)
- **Toggle** tasks complete with animated checkbox
- **Inline edit** task titles (double-click the title)
- **Delete** individual tasks (hover to reveal ✕)
- **Clear all done** tasks in one click
- Persistent error handling with dismissible banners
- Fully responsive (mobile-friendly)

---

## Tech Stack

| Layer    | Technology            |
|----------|-----------------------|
| Frontend | React 18, CSS3        |
| Backend  | Node.js, Express 4    |
| API      | REST (JSON)           |
| IDs      | UUID v4               |
| Storage  | In-memory (server)    |
