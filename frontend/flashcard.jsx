import { useEffect, useState } from "react";
import "./flashcard.css";

const API = "http://127.0.0.1:8000";

export default function Flashcard() {
  const [cards, setCards] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  // 📥 GET
  const fetchCards = async () => {
    const res = await fetch(API + "/flashcards");
    const data = await res.json();
    setCards(data);
  };

  useEffect(() => {
    fetchCards();
  }, []);

  // ➕ POST
  const addCard = async () => {
    if (!question || !answer) return;

    await fetch(API + "/flashcards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question, answer }),
    });

    setQuestion("");
    setAnswer("");
    fetchCards();
  };

  // ❌ DELETE
  const deleteCard = async (id) => {
    await fetch(API + "/flashcards/" + id, {
      method: "DELETE",
    });
    fetchCards();
  };

  return (
    <div>
      <h1>Flashcards</h1>

      {/* INPUT */}
      <div className="input-group">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Question"
        />
        <input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Answer"
        />
        <button onClick={addCard}>Add</button>
      </div>

      {/* CARDS */}
      <div className="cards">
        {cards.map((card) => (
          <div key={card.id} className="card">
            <h3>{card.question}</h3>
            <p>{card.answer}</p>
            <button onClick={() => deleteCard(card.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}