from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field


class Flashcard(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    question: str
    answer: str


class User(SQLModel, table=True):
    __tablename__ = "users"
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True)
    email: str = Field(unique=True)
    password_hash: str
    role: str = Field(default="user")  # "user" or "admin"


class ViewHistory(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    flashcard_id: int = Field(foreign_key="flashcard.id")
    viewed_at: datetime = Field(default_factory=datetime.utcnow)
