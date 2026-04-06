from sqlmodel import SQLModel, create_engine
from models import Flashcard

DATABASE_URL = "mysql+pymysql://root:1234@localhost:3306/flashcard_db"

engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)