import { useEffect, useState } from "react";
import "./flashcard.css";

const API = "http://127.0.0.1:8000";

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
}

export default function Flashcard({ user, onLogout, onAdmin }) {
  const [cards, setCards] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [discovered, setDiscovered] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");

  // Filter cards in real-time as user types
  const filtered = cards.filter(
    (c) =>
      c.question.toLowerCase().includes(search.toLowerCase()) ||
      c.answer.toLowerCase().includes(search.toLowerCase())
  );

  const progress = cards.length ? (discovered.length / cards.length) * 100 : 0;

  const fetchCards = async () => {
    const res = await fetch(API + "/flashcards");
    setCards(await res.json());
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const addCard = async () => {
    if (!question || !answer) return;
    await fetch(API + "/flashcards", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ question, answer }),
    });
    setQuestion("");
    setAnswer("");
    fetchCards();
  };

  const deleteCard = async (id) => {
    await fetch(API + "/flashcards/" + id, {
      method: "DELETE",
      headers: authHeaders(),
    });
    fetchCards();
  };

  const updateCard = async (id) => {
    await fetch(API + "/flashcards/" + id, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ question: editQuestion, answer: editAnswer }),
    });
    setEditingId(null);
    fetchCards();
  };

  // Log that the user viewed/flipped a card
  const logView = (id) => {
    fetch(API + `/flashcards/${id}/view`, {
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

  return (
    <div className="container">
      {/* Top bar with username and buttons */}
      <div className="top-bar">
        <h1>Bro's Secret</h1>
        <div className="user-bar">
          <span>👤 {user.username}</span>
          {user.role === "admin" && (
            <button onClick={onAdmin}>Admin Panel</button>
          )}
          <button onClick={onLogout}>Logout</button>
        </div>
      </div>

      <p>
        You've discovered {discovered.length} out of {cards.length} bro's secret 💖
      </p>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {progress === 100 && cards.length > 0 && (
        <p>🎉 Now you know your bro very well!</p>
      )}

      {/* Live search bar */}
      <div className="search-group">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search flashcards..."
        />
      </div>

      {/* Add new card */}
      <div className="input-group">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Bro"
        />
        <input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Bro's secret"
        />
        <button onClick={addCard}>Add</button>
      </div>

      {/* Card grid */}
      <div className="cards">
        {filtered.map((card) => (
          <FlipCard
            key={card.id}
            id={card.id}
            question={card.question}
            answer={card.answer}
            discovered={discovered}
            setDiscovered={setDiscovered}
            onDelete={() => deleteCard(card.id)}
            onView={() => logView(card.id)}
            editingId={editingId}
            setEditingId={setEditingId}
            editQuestion={editQuestion}
            setEditQuestion={setEditQuestion}
            editAnswer={editAnswer}
            setEditAnswer={setEditAnswer}
            onUpdate={updateCard}
          />
        ))}
      </div>
    </div>
  );
}

function FlipCard({
  id, question, answer, onDelete, onView,
  discovered, setDiscovered,
  editingId, setEditingId,
  editQuestion, setEditQuestion,
  editAnswer, setEditAnswer,
  onUpdate,
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="flip-card card-appear"
      onClick={() => {
        setFlipped(!flipped);
        if (!discovered.includes(id)) {
          setDiscovered([...discovered, id]);
          onView(); // log the first flip
        }
      }}
    >
      <div className={`flip-inner ${flipped ? "flipped" : ""}`}>

        <div className="flip-front">
          <h3>{question}</h3>
        </div>

        <div className="flip-back">
          {editingId === id ? (
            <>
              <input
                value={editQuestion}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setEditQuestion(e.target.value)}
              />
              <input
                value={editAnswer}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setEditAnswer(e.target.value)}
              />
              <button onClick={(e) => { e.stopPropagation(); onUpdate(id); }}>
                Save
              </button>
            </>
          ) : (
            <>
              <p>{answer}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingId(id);
                  setEditQuestion(question);
                  setEditAnswer(answer);
                }}
              >
                Edit
              </button>
              <button onClick={(e) => { e.stopPropagation(); onDelete(); }}>
                Delete
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
