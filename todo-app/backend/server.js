const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 5000;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// ─── In-Memory Data Store ──────────────────────────────────────────────────────
let tasks = [
  {
    id: uuidv4(),
    title: "Set up the project structure",
    completed: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: "Build REST API with Express",
    completed: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: "Connect React frontend to backend",
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

// ─── Helper ───────────────────────────────────────────────────────────────────
const findTaskById = (id) => tasks.find((t) => t.id === id);

// ─── Routes ───────────────────────────────────────────────────────────────────

/**
 * GET /api/tasks
 * Returns all tasks, optionally filtered by ?completed=true|false
 */
app.get("/api/tasks", (req, res) => {
  const { completed } = req.query;

  let result = [...tasks];
  if (completed !== undefined) {
    const isDone = completed === "true";
    result = result.filter((t) => t.completed === isDone);
  }

  res.status(200).json({
    success: true,
    count: result.length,
    data: result,
  });
});

/**
 * GET /api/tasks/:id
 * Returns a single task by ID
 */
app.get("/api/tasks/:id", (req, res) => {
  const task = findTaskById(req.params.id);
  if (!task) {
    return res
      .status(404)
      .json({ success: false, message: "Task not found" });
  }
  res.status(200).json({ success: true, data: task });
});

/**
 * POST /api/tasks
 * Creates a new task
 * Body: { title: string }
 */
app.post("/api/tasks", (req, res) => {
  const { title } = req.body;

  if (!title || title.trim() === "") {
    return res
      .status(400)
      .json({ success: false, message: "Task title is required" });
  }

  const newTask = {
    id: uuidv4(),
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  res.status(201).json({ success: true, data: newTask });
});

/**
 * PUT /api/tasks/:id
 * Updates a task (title and/or completed status)
 * Body: { title?: string, completed?: boolean }
 */
app.put("/api/tasks/:id", (req, res) => {
  const task = findTaskById(req.params.id);
  if (!task) {
    return res
      .status(404)
      .json({ success: false, message: "Task not found" });
  }

  const { title, completed } = req.body;

  if (title !== undefined) {
    if (title.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Title cannot be empty" });
    }
    task.title = title.trim();
  }

  if (completed !== undefined) {
    task.completed = Boolean(completed);
  }

  task.updatedAt = new Date().toISOString();

  res.status(200).json({ success: true, data: task });
});

/**
 * DELETE /api/tasks/:id
 * Deletes a task by ID
 */
app.delete("/api/tasks/:id", (req, res) => {
  const index = tasks.findIndex((t) => t.id === req.params.id);
  if (index === -1) {
    return res
      .status(404)
      .json({ success: false, message: "Task not found" });
  }

  tasks.splice(index, 1);
  res
    .status(200)
    .json({ success: true, message: "Task deleted successfully" });
});

/**
 * DELETE /api/tasks
 * Deletes all completed tasks
 */
app.delete("/api/tasks", (req, res) => {
  const before = tasks.length;
  tasks = tasks.filter((t) => !t.completed);
  const removed = before - tasks.length;
  res.status(200).json({
    success: true,
    message: `${removed} completed task(s) cleared`,
  });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅  Server running at http://localhost:${PORT}`);
  console.log(`📋  API endpoints:`);
  console.log(`    GET    /api/tasks`);
  console.log(`    GET    /api/tasks/:id`);
  console.log(`    POST   /api/tasks`);
  console.log(`    PUT    /api/tasks/:id`);
  console.log(`    DELETE /api/tasks/:id`);
  console.log(`    DELETE /api/tasks  (clear completed)`);
});
