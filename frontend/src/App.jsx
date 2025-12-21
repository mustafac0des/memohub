import { useEffect, useState, useRef } from "react";
import api from "./api";
import "./App.css";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [content, setContent] = useState("");
  const [memos, setMemos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState("General");
  const [memoColor, setMemoColor] = useState("#3b82f6");
  const textAreaRef = useRef(null);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  const auth = async (path) => {
    try {
      setError("");
      const res = await api.post(`/auth/${path}`, { username, password });
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        setUsername("");
        setPassword("");
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          `${path.charAt(0).toUpperCase() + path.slice(1)} failed`
      );
    }
  };

  const loadMemos = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== "All") {
        params.append("category", selectedCategory);
      }
      if (searchQuery) {
        params.append("search", searchQuery);
      }
      params.append("sort", sortBy);

      const res = await api.get(`/memo?${params}`);
      setMemos(res.data);
    } catch (err) {
      console.error("Load memos error:", err);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await api.get("/memo/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Load categories error:", err);
    }
  };

  const addMemo = async () => {
    if (!content.trim()) return;
    try {
      await api.post("/memo", {
        content,
        category: editCategory,
        color: memoColor
      });
      setContent("");
      setEditCategory("General");
      setMemoColor("#3b82f6");
      loadMemos();
      loadCategories();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add memo");
    }
  };

  const updateMemo = async (id) => {
    if (!editContent.trim()) return;
    try {
      await api.put(`/memo/${id}`, {
        content: editContent,
        category: editCategory,
        color: memoColor
      });
      setEditingId(null);
      loadMemos();
      loadCategories();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update memo");
    }
  };

  const togglePin = async (memo) => {
    try {
      await api.put(`/memo/${memo.id}`, {
        content: memo.content,
        category: memo.category,
        pinned: !memo.pinned,
        color: memo.color
      });
      loadMemos();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to pin memo");
    }
  };

  const deleteMemo = async (id) => {
    if (!window.confirm("Delete this memo?")) return;
    try {
      await api.delete(`/memo/${id}`);
      loadMemos();
      loadCategories();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete memo");
    }
  };

  const startEdit = (memo) => {
    setEditingId(memo.id);
    setEditContent(memo.content);
    setEditCategory(memo.category);
    setMemoColor(memo.color);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setMemos([]);
    setSearchQuery("");
    setSelectedCategory("All");
  };

  // Load data on token change or filters change
  useEffect(() => {
    if (token) {
      loadMemos();
      loadCategories();
    }
  }, [token, selectedCategory, searchQuery, sortBy]);

  if (!token) {
    return (
      <div className={`page auth-page ${darkMode ? "dark" : ""}`}>
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">📝</div>
            <h1>MemoHub</h1>
            <p className="subtitle">Your personal note manager</p>
          </div>

          <div className="auth-form">
            <input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && auth("login")}
            />

            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && auth("login")}
            />

            <div className="auth-actions">
              <button className="btn-primary" onClick={() => auth("login")}>
                Login
              </button>
              <button className="btn-secondary" onClick={() => auth("register")}>
                Register
              </button>
            </div>

            {error && <p className="error-message">{error}</p>}
          </div>

          <div className="dark-mode-toggle">
            <button
              className="theme-btn"
              onClick={() => setDarkMode(!darkMode)}
              title="Toggle dark mode"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`app-container ${darkMode ? "dark" : ""}`}>
      {/* Header */}
      <header className="app-header">
        <div className="header-left">
          <div className="app-title">
            <span className="title-icon">📝</span>
            <h1>MemoHub</h1>
          </div>
        </div>

        <div className="header-right">
          <button
            className="theme-btn"
            onClick={() => setDarkMode(!darkMode)}
            title="Toggle dark mode"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
          <button className="btn-logout" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        <div className="app-grid">
          {/* Sidebar */}
          <aside className="app-sidebar">
            <div className="sidebar-section">
              <h3>Categories</h3>
              <div className="category-list">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`category-btn ${
                      selectedCategory === cat ? "active" : ""
                    }`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                    {cat !== "All" && (
                      <span className="memo-count">
                        {memos.filter((m) => m.category === cat).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="sidebar-section">
              <h3>Sort By</h3>
              <div className="sort-options">
                {[
                  { value: "newest", label: "Newest First" },
                  { value: "oldest", label: "Oldest First" },
                  { value: "alphabetical", label: "A-Z" }
                ].map((option) => (
                  <label key={option.value} className="sort-label">
                    <input
                      type="radio"
                      name="sort"
                      value={option.value}
                      checked={sortBy === option.value}
                      onChange={(e) => setSortBy(e.target.value)}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <section className="app-content">
            {/* New Memo Editor */}
            <div className="new-memo-section">
              <div className="new-memo-card">
                <textarea
                  ref={textAreaRef}
                  placeholder="What's on your mind? Write a memo..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="memo-textarea"
                  rows="3"
                />

                <div className="memo-options">
                  <div className="option-group">
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="category-select"
                    >
                      <option>General</option>
                      <option>Work</option>
                      <option>Personal</option>
                      <option>Ideas</option>
                      <option>Todo</option>
                    </select>

                    <div className="color-picker">
                      {[
                        "#3b82f6",
                        "#ef4444",
                        "#10b981",
                        "#f59e0b",
                        "#8b5cf6",
                        "#ec4899"
                      ].map((color) => (
                        <button
                          key={color}
                          className={`color-btn ${
                            memoColor === color ? "active" : ""
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setMemoColor(color)}
                          title={`Color ${color}`}
                        />
                      ))}
                    </div>
                  </div>

                  <button className="btn-add-memo" onClick={addMemo}>
                    + Add Memo
                  </button>
                </div>

                {error && <p className="error-message">{error}</p>}
              </div>
            </div>

            {/* Search */}
            <div className="search-section">
              <input
                type="text"
                placeholder="🔍 Search memos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button
                  className="clear-search"
                  onClick={() => setSearchQuery("")}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Memos List */}
            <div className="memos-section">
              {memos.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <p>No memos yet. Create one to get started!</p>
                </div>
              ) : (
                <div className="memo-grid">
                  {memos.map((memo) => (
                    <div
                      key={memo.id}
                      className="memo-card"
                      style={{ borderLeftColor: memo.color }}
                    >
                      {editingId === memo.id ? (
                        <>
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="memo-edit-textarea"
                          />
                          <select
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                            className="category-select"
                          >
                            <option>General</option>
                            <option>Work</option>
                            <option>Personal</option>
                            <option>Ideas</option>
                            <option>Todo</option>
                          </select>
                          <div className="edit-actions">
                            <button
                              className="btn-save"
                              onClick={() => updateMemo(memo.id)}
                            >
                              Save
                            </button>
                            <button
                              className="btn-cancel"
                              onClick={() => setEditingId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="memo-header">
                            <span className="memo-category">{memo.category}</span>
                            <div className="memo-meta">
                              <span className="memo-time">
                                {new Date(memo.updatedAt).toLocaleDateString()}
                              </span>
                              <button
                                className={`pin-btn ${
                                  memo.pinned ? "pinned" : ""
                                }`}
                                onClick={() => togglePin(memo)}
                                title={
                                  memo.pinned ? "Unpin memo" : "Pin memo"
                                }
                              >
                                📌
                              </button>
                            </div>
                          </div>

                          <p className="memo-content">{memo.content}</p>

                          <div className="memo-footer">
                            <button
                              className="btn-edit"
                              onClick={() => startEdit(memo)}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              className="btn-delete"
                              onClick={() => deleteMemo(memo.id)}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
