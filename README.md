# Bro’s Secret 💖

## 📌 Project Overview
Bro’s Secret is a single-page web application that allows users to store and explore fun facts (secrets) about their friends. Users can add, view, and delete secrets while tracking how many they have discovered.

---

## 🎯 Purpose
The purpose of this application is to create a fun and interactive way for users to learn more about their friends. Instead of a traditional flashcard system, this app focuses on discovering personal and social information in an engaging way.

---

## 🛠️ Tech Stack
- Frontend: React (Vite)
- Backend: FastAPI (Python)
- Database: MySQL
- Styling: CSS

---

## ✨ Features
- Add new secrets (Create)
- View all secrets (Read)
- Delete secrets (Delete)
- Flip card animation to reveal secrets
- Discovery tracking system (progress bar)
- Responsive layout (mobile friendly)
- Input validation for better data quality

---

## 🧠 Business Logic
The application includes a discovery tracking system where each card is marked as “discovered” when clicked. A progress bar visually represents how many secrets the user has explored. This creates a meaningful user experience beyond basic CRUD operations.

---

## 📂 Folder Structure
myFlashcard/
├── backend/
│ ├── main.py
│ ├── models.py
│ └── database.py
│
├── frontend/
│ ├── flashcard.jsx
│ ├── flashcard.css
│
├── src/
│ ├── App.jsx
│ ├── main.jsx
│ └── index.css

---


---

## ⚠️ Challenges Faced
One challenge was connecting the frontend and backend correctly, especially handling API requests. Another challenge was managing state in React, such as tracking discovered cards and updating the UI dynamically. Styling and layout issues (such as alignment and responsiveness) also required debugging and adjustments.

---

## 🚀 Future Improvements
- Add edit/update functionality
- Store discovery progress in the database
- Improve UI with animations and icons
- Add categories or tags for secrets