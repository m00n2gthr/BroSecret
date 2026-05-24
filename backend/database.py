from sqlmodel import SQLModel, create_engine

DATABASE_URL = "mysql+pymysql://root:1234@localhost:3306/flashcard_db"

engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    # Import all models here so SQLModel registers them before creating tables
    from models import Flashcard, User, ViewHistory  # noqa: F401
    SQLModel.metadata.create_all(engine)
