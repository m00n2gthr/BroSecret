import { useEffect, useState } from "react";
import "./flashcard.css";

const API = "http://127.0.0.1:8000";

export default function Admin({ user, onBack, onLogout }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(API + "/admin/history", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setHistory);
  }, []);

  return (
    <div className="container">
      <div className="top-bar">
        <h1>Admin Panel</h1>
        <div className="user-bar">
          <span>{user.username}</span>
          <button onClick={onBack}>Back to Cards</button>
          <button onClick={onLogout}>Logout</button>
        </div>
      </div>

      <div className="history-table">
        {history.length === 0 ? (
          <p>No view history yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Flashcard</th>
                <th>Viewed At</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, i) => (
                <tr key={i}>
                  <td>{h.username}</td>
                  <td>{h.question}</td>
                  <td>{new Date(h.viewed_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
