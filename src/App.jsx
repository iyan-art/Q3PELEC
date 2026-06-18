import React, { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:8000/api/tasks/';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function fetchTasks() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setTasks(data);
    } catch (e) {
      setError(e.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }

  async function addTask(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    setError('');
    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: trimmed, is_completed: false })
      });

      if (!res.ok) {
        const body = await res.text();
        throw new Error(`HTTP ${res.status}: ${body}`);
      }

      setTitle('');
      await fetchTasks();
    } catch (e) {
      setError(e.message || 'Failed to create task');
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="appRoot">
      <div className="appShell">
        <header className="appHeader">
          <h2 className="appTitle">Task Management System</h2>
          <p className="appSubtitle">Create, review, and track your tasks.</p>
        </header>

        <form className="taskForm" onSubmit={addTask}>
          <label className="srOnly" htmlFor="taskTitle">
            Task title
          </label>
          <input
            id="taskTitle"
            className="taskInput"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            disabled={loading}
          />
          <button className="taskButton" type="submit" disabled={loading || !title.trim()}>
            Add
          </button>
        </form>

        {error && (
          <div className="alert" role="alert">
            {error}
          </div>
        )}

        <section className="taskSection" aria-live="polite">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : tasks.length === 0 ? (
            <div className="empty">No tasks yet. Add your first one above.</div>
          ) : (
            <ul className="taskList">
              {tasks.map((t) => (
                <li key={t.id} className="taskItem">
                  <span className={t.is_completed ? 'taskText taskText--done' : 'taskText'}>{t.title}</span>
                  <span
                    className={
                      t.is_completed ? 'taskMeta taskMeta--done' : 'taskMeta'
                    }
                  >
                    {t.is_completed ? '(completed)' : '(not completed)'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}


