import React, { useState, useEffect, useCallback } from "react";
import {
  fetchTasks, createTask, updateTask, deleteTask, clearCompleted,
} from "./api";
import "./App.css";

// ─── Icons ────────────────────────────────────────────────────────────────────
const CheckIcon = () => (
  <svg viewBox="0 0 12 12"><polyline points="1.5,6 4.5,9.5 10.5,2.5"/></svg>
);
const PlusIcon = () => (
  <svg viewBox="0 0 14 14"><line x1="7" y1="1" x2="7" y2="13"/><line x1="1" y1="7" x2="13" y2="7"/></svg>
);
const XIcon = () => (
  <svg viewBox="0 0 13 13"><line x1="1" y1="1" x2="12" y2="12"/><line x1="12" y1="1" x2="1" y2="12"/></svg>
);
const ClipboardIcon = () => (
  <svg viewBox="0 0 18 18">
    <rect x="3" y="4" width="12" height="13" rx="2"/>
    <path d="M6 4V3a1 1 0 011-1h4a1 1 0 011 1v1"/>
    <line x1="6" y1="9" x2="12" y2="9"/>
    <line x1="6" y1="12" x2="10" y2="12"/>
  </svg>
);
const InboxIcon = () => (
  <svg viewBox="0 0 32 32">
    <rect x="4" y="6" width="24" height="20" rx="3"/>
    <path d="M4 20h6l2 3h8l2-3h6"/>
  </svg>
);

// ─── TaskItem ─────────────────────────────────────────────────────────────────
function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(task.title);

  const commit = () => {
    if (val.trim() && val !== task.title) onEdit(task.id, val.trim());
    setEditing(false);
  };

  const onKey = (e) => {
    if (e.key === "Enter") commit();
    if (e.key === "Escape") { setVal(task.title); setEditing(false); }
  };

  return (
    <li className={`task-item${task.completed ? " completed" : ""}`}>
      <button
        className="check-btn"
        onClick={() => onToggle(task.id, !task.completed)}
        aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
      >
        <CheckIcon />
      </button>

      {editing ? (
        <input
          className="edit-input"
          value={val}
          autoFocus
          onChange={(e) => setVal(e.target.value)}
          onBlur={commit}
          onKeyDown={onKey}
        />
      ) : (
        <span
          className="task-title"
          onDoubleClick={() => !task.completed && setEditing(true)}
          title={task.completed ? "" : "Double-click to edit"}
        >
          {task.title}
        </span>
      )}

      <button className="delete-btn" onClick={() => onDelete(task.id)} aria-label="Delete">
        <XIcon />
      </button>
    </li>
  );
}

// ─── FilterBar ────────────────────────────────────────────────────────────────
function FilterBar({ filter, setFilter, total, doneCount, onClear }) {
  const pending = total - doneCount;
  return (
    <div className="filter-bar">
      <span className="task-count">
        <strong>{pending}</strong> task{pending !== 1 ? "s" : ""} remaining
      </span>
      <div className="filter-buttons">
        {["all", "active", "completed"].map((f) => (
          <button
            key={f}
            className={`filter-btn${filter === f ? " active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      <button className="clear-btn" onClick={onClear} disabled={doneCount === 0}>
        Clear completed
      </button>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true); setError(null);
      const res = await fetchTasks();
      setTasks(res.data);
    } catch {
      setError("Could not reach server. Is the backend running on port 5000?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!input.trim() || submitting) return;
    try {
      setSubmitting(true);
      const res = await createTask(input.trim());
      setTasks((p) => [...p, res.data]);
      setInput("");
    } catch (err) { setError(err.message); }
    finally { setSubmitting(false); }
  };

  const handleToggle = async (id, completed) => {
    try {
      const res = await updateTask(id, { completed });
      setTasks((p) => p.map((t) => (t.id === id ? res.data : t)));
    } catch (err) { setError(err.message); }
  };

  const handleEdit = async (id, title) => {
    try {
      const res = await updateTask(id, { title });
      setTasks((p) => p.map((t) => (t.id === id ? res.data : t)));
    } catch (err) { setError(err.message); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks((p) => p.filter((t) => t.id !== id));
    } catch (err) { setError(err.message); }
  };

  const handleClear = async () => {
    try {
      await clearCompleted();
      setTasks((p) => p.filter((t) => !t.completed));
    } catch (err) { setError(err.message); }
  };

  const visible = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const doneCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="app">

      {/* Page Header */}
      <div className="page-header">
        <div className="brand">
          <div className="brand-icon"><ClipboardIcon /></div>
          <div className="brand-text">
            <h1>TaskManager</h1>
            <p>Organize your work efficiently</p>
          </div>
        </div>
        <div className="header-stats">
          <div className="stat-num">{tasks.length}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
      </div>

      {/* Card */}
      <div className="card">
        {/* Add Form */}
        <form className="add-form" onSubmit={handleAdd}>
          <input
            type="text"
            className="add-input"
            placeholder="Enter a new task..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={submitting}
            maxLength={120}
          />
          <button type="submit" className="add-btn" disabled={!input.trim() || submitting}>
            <PlusIcon />
            {submitting ? "Adding..." : "Add Task"}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="error-banner">
            ⚠ {error}
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

        {/* Section Header */}
        {tasks.length > 0 && (
          <div className="section-header">
            <span className="section-title">
              {filter === "all" ? "All Tasks" : filter === "active" ? "Active Tasks" : "Completed Tasks"}
            </span>
            <span className="badge">{visible.length}</span>
          </div>
        )}

        {/* Task List */}
        {loading ? (
          <p className="state-msg">Loading tasks...</p>
        ) : visible.length === 0 ? (
          <p className="state-msg">
            <InboxIcon />
            {filter === "completed"
              ? "No completed tasks."
              : filter === "active"
              ? "All tasks completed!"
              : "No tasks yet. Add your first task above."}
          </p>
        ) : (
          <ul className="task-list">
            {visible.map((t) => (
              <TaskItem
                key={t.id}
                task={t}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </ul>
        )}

        {/* Filter Bar */}
        {tasks.length > 0 && (
          <FilterBar
            filter={filter}
            setFilter={setFilter}
            total={tasks.length}
            doneCount={doneCount}
            onClear={handleClear}
          />
        )}
      </div>

      <p className="app-footer">Double-click any task title to edit it inline</p>
    </div>
  );
}
