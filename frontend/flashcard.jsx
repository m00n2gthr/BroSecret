import { useEffect, useState } from "react";
import "./flashcard.css";

const API = "http://127.0.0.1:8000";


export default function Flashcard() {
  const [cards, setCards] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [discovered, setDiscovered] = useState([]);
  const progress = (discovered.length / cards.length) * 100;
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
    <div className="container">
      <h1>Bro’s Secret</h1>
      <p>
        You’ve discovered {discovered.length} out of {cards.length} bro’s secret 💖
      </p>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      {progress === 100 && <p>🎉 Now you know your bro very well!</p>}
      {/* INPUT */}
      <div className="input-group">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Bro"
        />
        <input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Bro’s secret"
        />
        <button onClick={addCard}>Add</button>
      </div>

      {/* CARDS */}
      <div className="cards">
        {cards.map((card) => (
          <FlipCard
            key={card.id}
            id={card.id}
            question={card.question}
            answer={card.answer}
            discovered={discovered}
            setDiscovered={setDiscovered}
            onDelete={() => deleteCard(card.id)}
          />
        ))}
      </div>
    </div>
  );
}

function FlipCard({ id, question, answer, onDelete, discovered, setDiscovered }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="flip-card card-appear"
      onClick={() => {
        setFlipped(!flipped);

        if (!discovered.includes(id)) {
          setDiscovered([...discovered, id]);
        }
      }}
    >
      <div className={`flip-inner ${flipped ? "flipped" : ""}`}>
        
        {/* FRONT */}
        <div className="flip-front">
          <h3>{question}</h3>
        </div>

        {/* BACK */}
        <div className="flip-back">
          <p>{answer}</p>
          <button
            onClick={(e) => {
              e.stopPropagation(); // prevent flip
              onDelete();
            }}
          >
            Delete
          </button>
        </div>

      </div>
    </div>
  );
}