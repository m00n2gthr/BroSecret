from fastapi import FastAPI
from sqlmodel import Session, select
from database import engine, create_db_and_tables
from models import Flashcard

app = FastAPI()

@app.get("/")
def read_root():
    return {
        "message": "Flashcard API is running",
        "endpoints": ["GET /flashcards", "POST /flashcards", "DELETE /flashcards/{card_id}"]
    }

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# ✅ CREATE
@app.post("/flashcards")
def create_flashcard(card: Flashcard):
    with Session(engine) as session:
        session.add(card)
        session.commit()
        session.refresh(card)
        return card

# ✅ READ
@app.get("/flashcards")
def get_flashcards():
    with Session(engine) as session:
        cards = session.exec(select(Flashcard)).all()
        return cards

# ✅ DELETE
@app.delete("/flashcards/{card_id}")
def delete_flashcard(card_id: int):
    with Session(engine) as session:
        card = session.get(Flashcard, card_id)
        if not card:
            return {"error": "Not found"}
        session.delete(card)
        session.commit()
        return {"message": "Deleted"}