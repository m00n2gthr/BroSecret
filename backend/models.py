from sqlmodel import SQLModel, Field

class Flashcard(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    question: str
    answer: str
