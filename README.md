# Bro’s Secret 💖

## 📌 Project Overview

Bro’s Secret is a fun single-page web application that allows users to create and explore “secrets” about their friends. Each friend is represented as a flashcard that can be flipped to reveal hidden information.

The app focuses on interaction, discovery, and a playful user experience rather than testing or scoring.

---

## 🎯 Features

* Create new flashcards (Add friend + secret)
* View all flashcards on one page
* Flip cards to reveal secrets
* Track discovery progress (friendship progress bar 💕)
* Edit existing flashcards
* Delete flashcards
* Smooth flip animation and responsive layout

---

## 🧱 Tech Stack

### Frontend

* React (Vite)
* CSS (custom styling + animations)

### Backend

* FastAPI (Python)
* SQLModel (ORM)

### Database

* MySQL

---

## 🔄 CRUD Functionality

The application supports full CRUD operations:

* **Create** → Add new flashcards
* **Read** → Display all flashcards
* **Update** → Edit existing flashcards
* **Delete** → Remove flashcards

---

## 💾 Database

The database is included in this project inside the `/database` folder.

```bash
/database/flashcard_db.sql
```

### How to use:

1. Open MySQL Workbench
2. Go to **Server → Data Import**
3. Select **Import from Self-Contained File**
4. Choose `flashcard_db.sql`
5. Start Import

This will recreate the database structure and data required for the application.

---

## 📁 Project Structure

```bash
BroSecret/
├── backend/        # FastAPI backend
├── frontend/       # Custom React components
├── src/            # Main React app (Vite)
├── database/       # Database export (.sql)
├── package.json
├── README.md
```

---

## 🚀 How to Run

### 1. Backend

```bash
cd backend
uvicorn main:app --reload
```

---

### 2. Frontend

```bash
npm install
npm run dev
```

Open:
👉 http://localhost:5173

---

## ✨ Design & UX

* Clean pink theme for a friendly vibe
* Flip card animation for interaction
* Progress bar for engagement
* Responsive grid layout (works on mobile)

---

## ⚠️ Notes

* Make sure MySQL is running before starting backend
* Backend runs on `http://127.0.0.1:8000`
* Frontend connects via REST API

---

## 👨‍💻 Author

Created as part of a Internet Programming assignment.
