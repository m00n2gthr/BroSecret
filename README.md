# Bro's Secret 💖

## 📌 Project Overview

Bro's Secret is a fun single-page web application that allows users to create and explore "secrets" about their friends. Each friend is represented as a flashcard that can be flipped to reveal hidden information.

The app focuses on interaction, discovery, and a playful user experience rather than testing or scoring.

---

## 🎯 Features

* **Register / Login** — User authentication with password hashing (bcrypt) and JWT tokens
* **Live Search** — Search bar that filters flashcards in real-time as you type
* **Create** flashcards (Add friend + secret)
* **Read** all flashcards on one page
* **Update** existing flashcards inline
* **Delete** flashcards
* **Flip cards** to reveal secrets + discovery progress bar 💕
* **View History** — Every card flip is logged per user
* **Admin Panel** — Admins can view all users' learning history
* Smooth flip animation and responsive layout

---

## 🧱 Tech Stack

### Frontend

* React 19 (Vite)
* CSS (custom styling + animations)

### Backend

* FastAPI (Python)
* SQLModel (ORM)
* bcrypt — password hashing
* python-jose — JWT authentication

### Database

* MySQL

---

## 🔄 CRUD Functionality

| Operation | Where |
|-----------|-------|
| **Create** | Add new flashcards |
| **Read** | Display all flashcards + live search filter |
| **Update** | Edit flashcard question/answer inline |
| **Delete** | Remove flashcards |

---

## 🔐 Authentication

* Passwords are hashed with **bcrypt** before storing
* On login/register, the server returns a **JWT token**
* The token is saved in `localStorage` and sent as `Authorization: Bearer <token>` on every write request
* Users stay logged in across page refreshes

### Roles

| Role | Permissions |
|------|------------|
| `user` | CRUD on flashcards, view own history |
| `admin` | Everything + Admin Panel (view all users' history) |

To promote a user to admin:
```sql
UPDATE users SET role = 'admin' WHERE username = 'yourname';
```

---

## 📊 View History

Every time a user flips a flashcard for the first time, it is logged in the `viewhistory` table:

| Column | Description |
|--------|-------------|
| `user_id` | Who viewed it |
| `flashcard_id` | Which card was flipped |
| `viewed_at` | Timestamp |

Admins can see this full history in the **Admin Panel**.

---

## 💾 Database Setup

The `/database` folder contains one SQL file per table:

```
database/
├── flashcard_db_flashcard.sql    # flashcard table
├── flashcard_db_users.sql        # users table
└── flashcard_db_viewhistory.sql  # viewhistory table
```

### Import steps:

1. Open MySQL Workbench
2. Go to **Server → Data Import**
3. Select **Import from Self-Contained File**
4. Import each `.sql` file one by one (flashcard → users → viewhistory)
5. Click **Start Import** for each

> Import in the order above — `viewhistory` has foreign keys that depend on `users` and `flashcard`.

The backend will also auto-create any missing tables on startup.

---

## 📁 Project Structure

```
BroSecret/
├── backend/
│   ├── main.py         # FastAPI routes (auth, flashcards, history)
│   ├── models.py       # SQLModel table definitions
│   └── database.py     # DB connection + table creation
├── frontend/
│   ├── flashcard.jsx   # Main flashcard view (CRUD + search)
│   ├── auth.jsx        # Login / Register page
│   ├── admin.jsx       # Admin history panel
│   └── flashcard.css   # All styles
├── src/
│   ├── App.jsx         # SPA view router (auth → cards → admin)
│   └── main.jsx        # React entry point
├── database/
│   ├── flashcard_db_flashcard.sql
│   ├── flashcard_db_users.sql
│   └── flashcard_db_viewhistory.sql
├── package.json
└── README.md
```

---

## 🚀 How to Run

### 1. Install Python dependencies

```bash
pip install fastapi uvicorn sqlmodel pymysql bcrypt python-jose[cryptography]
```

### 2. Start the Backend

```bash
cd backend
uvicorn main:app --reload
```

### 3. Start the Frontend

```bash
npm install
npm run dev
```

Open: 👉 http://localhost:5173

---

## ✨ Design & UX

* Clean pink gradient theme
* 3D flip card animation
* Real-time search filtering (no page reload)
* Progress bar tracks discovery
* Responsive grid (works on mobile)
* Single-page app — all views load without page refresh

---

## ⚠️ Notes

* Make sure MySQL is running before starting the backend
* Backend runs on `http://127.0.0.1:8000`
* Frontend connects to the backend via REST API

---

## 👨‍💻 Author

Created as part of an Internet Programming assignment.
