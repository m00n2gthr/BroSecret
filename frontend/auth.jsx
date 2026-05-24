import { useState } from "react";
import "./flashcard.css";

const API = "http://127.0.0.1:8000";

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState("login"); // "login" or "register"
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    const url = mode === "login" ? "/auth/login" : "/auth/register";
    const body = mode === "login"
      ? { username, password }
      : { username, email, password };

    const res = await fetch(API + url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.detail || "Something went wrong");
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify({ username: data.username, role: data.role }));
    onLogin({ username: data.username, role: data.role });
  };

  return (
    <div className="auth-page">
      <h1>Bro's Secret 💖</h1>

      <div className="auth-box">
        {/* Tab switcher */}
        <div className="auth-tabs">
          <button
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={mode === "register" ? "active" : ""}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <div className="auth-form">
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {mode === "register" && (
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          )}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="auth-error">{error}</p>}
          <button onClick={submit}>
            {mode === "login" ? "Login" : "Register"}
          </button>
        </div>
      </div>
    </div>
  );
}
