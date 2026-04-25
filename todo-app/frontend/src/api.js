// ─── API Service Layer ────────────────────────────────────────────────────────
// All fetch calls to the Express backend are centralized here.
// The React app's package.json "proxy" field forwards /api/* to localhost:5000

const API_BASE = "/api/tasks";

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
};

/** GET /api/tasks — fetch all tasks */
export const fetchTasks = () =>
  fetch(API_BASE).then(handleResponse);

/** POST /api/tasks — create a task */
export const createTask = (title) =>
  fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  }).then(handleResponse);

/** PUT /api/tasks/:id — toggle completed or update title */
export const updateTask = (id, updates) =>
  fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  }).then(handleResponse);

/** DELETE /api/tasks/:id — delete a single task */
export const deleteTask = (id) =>
  fetch(`${API_BASE}/${id}`, { method: "DELETE" }).then(handleResponse);

/** DELETE /api/tasks — clear all completed tasks */
export const clearCompleted = () =>
  fetch(API_BASE, { method: "DELETE" }).then(handleResponse);
