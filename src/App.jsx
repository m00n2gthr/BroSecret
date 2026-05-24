import { useState, useEffect } from "react";
import Auth from "../frontend/auth";
import Flashcard from "../frontend/flashcard";
import Admin from "../frontend/admin";

function App() {
  const [view, setView] = useState("auth"); // "auth" | "cards" | "admin"
  const [user, setUser] = useState(null);

  // On load, check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const saved = localStorage.getItem("user");
    if (token && saved) {
      setUser(JSON.parse(saved));
      setView("cards");
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setView("cards");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setView("auth");
  };

  if (view === "auth") return <Auth onLogin={handleLogin} />;
  if (view === "admin") return <Admin user={user} onBack={() => setView("cards")} onLogout={handleLogout} />;
  return <Flashcard user={user} onLogout={handleLogout} onAdmin={() => setView("admin")} />;
}

export default App;
