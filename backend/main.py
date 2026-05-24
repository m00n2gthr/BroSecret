from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session, select
from pydantic import BaseModel
import bcrypt
from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone

from database import engine, create_db_and_tables
from models import Flashcard, User, ViewHistory

# --- Config ---
SECRET_KEY = "flashcard-secret-key"
ALGORITHM = "HS256"
TOKEN_EXPIRE_HOURS = 24

bearer = HTTPBearer()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()


# --- Helper functions ---

def hash_password(password: str):
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def check_password(plain: str, hashed: str):
    return bcrypt.checkpw(plain.encode(), hashed.encode())

def make_token(user_id: int, role: str):
    expire = datetime.now(timezone.utc) + timedelta(hours=TOKEN_EXPIRE_HOURS)
    return jwt.encode({"id": user_id, "role": role, "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(creds: HTTPAuthorizationCredentials = Depends(bearer)):
    try:
        data = jwt.decode(creds.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        return {"id": data["id"], "role": data["role"]}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


# --- Request bodies ---

class RegisterBody(BaseModel):
    username: str
    email: str
    password: str

class LoginBody(BaseModel):
    username: str
    password: str


# --- Auth routes ---

@app.post("/auth/register")
def register(body: RegisterBody):
    with Session(engine) as session:
        existing = session.exec(select(User).where(User.username == body.username)).first()
        if existing:
            raise HTTPException(status_code=400, detail="Username already taken")
        user = User(username=body.username, email=body.email, password_hash=hash_password(body.password))
        session.add(user)
        session.commit()
        session.refresh(user)
        token = make_token(user.id, user.role)
        return {"token": token, "username": user.username, "role": user.role}

@app.post("/auth/login")
def login(body: LoginBody):
    with Session(engine) as session:
        user = session.exec(select(User).where(User.username == body.username)).first()
        if not user or not check_password(body.password, user.password_hash):
            raise HTTPException(status_code=401, detail="Wrong username or password")
        token = make_token(user.id, user.role)
        return {"token": token, "username": user.username, "role": user.role}


# --- Flashcard routes ---

@app.get("/flashcards")
def get_flashcards():
    with Session(engine) as session:
        return session.exec(select(Flashcard)).all()

@app.post("/flashcards")
def create_flashcard(card: Flashcard, _user=Depends(get_current_user)):
    with Session(engine) as session:
        session.add(card)
        session.commit()
        session.refresh(card)
        return card

@app.put("/flashcards/{id}")
def update_flashcard(id: int, updated: Flashcard, user=Depends(get_current_user)):
    with Session(engine) as session:
        card = session.get(Flashcard, id)
        if not card:
            raise HTTPException(status_code=404, detail="Flashcard not found")
        card.question = updated.question
        card.answer = updated.answer
        session.add(card)
        session.commit()
        session.refresh(card)
        return card

@app.delete("/flashcards/{id}")
def delete_flashcard(id: int, user=Depends(get_current_user)):
    with Session(engine) as session:
        card = session.get(Flashcard, id)
        if not card:
            raise HTTPException(status_code=404, detail="Flashcard not found")
        session.delete(card)
        session.commit()
        return {"message": "Deleted"}


# --- View history ---

@app.post("/flashcards/{card_id}/view")
def log_view(card_id: int, user=Depends(get_current_user)):
    with Session(engine) as session:
        session.add(ViewHistory(user_id=user["id"], flashcard_id=card_id))
        session.commit()
        return {"message": "Logged"}

@app.get("/admin/history")
def get_history(user=Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    with Session(engine) as session:
        histories = session.exec(select(ViewHistory).order_by(ViewHistory.viewed_at.desc())).all()
        result = []
        for h in histories:
            u = session.get(User, h.user_id)
            card = session.get(Flashcard, h.flashcard_id)
            if u and card:
                result.append({
                    "username": u.username,
                    "question": card.question,
                    "viewed_at": h.viewed_at.isoformat(),
                })
        return result
