# Personal Health Dashboard 🏃‍♂️💧🥗

A modern, responsive, and intelligent web application designed to help users track, analyze, and improve their daily health metrics. Built with React, FastAPI, and SQLite.

## Features ✨

- **Health Tracking**: Log your daily weight, calories intake, steps count, sleep hours, and water intake.
- **Interactive Dashboard**: Visualize your health trends with beautiful, dynamic charts using Recharts.
- **AI-Based Insights**: Get simple, personalized tips based on your logged data and goals (e.g., trend analysis on weight, sleep duration checks).
- **Goal Setting**: Set personal daily targets and monitor progress through interactive progress bars.
- **User Authentication**: Secure sign up and login with JWT and password hashing.
- **Modern UI**: A premium dark-mode glassmorphism design that feels responsive and alive.

## Tech Stack 🛠️

- **Frontend**: React, Vite, React Router, Recharts, Lucide Icons, Axios.
- **Backend**: FastAPI, SQLAlchemy, Pydantic, Passlib, Python-JOSE, Scikit-learn (for linear regression trend analysis).
- **Database**: SQLite (easy setup, serverless).

## Installation & Setup 🚀

### 1. Clone the repository
```bash
git clone <repository-url>
cd StayFit-Dashboard
```

### 2. Backend Setup
Make sure you have Python 3.8+ installed.

```bash
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
# On Windows:
venv\Scripts\activate
# On MacOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload
```
The API will be available at `http://localhost:8000`.

### 3. Frontend Setup
Make sure you have Node.js 18+ installed.

```bash
cd frontend

# Install dependencies
npm install

# Start the Vite dev server
npm run dev
```
The frontend will be available at `http://localhost:5173`.

## Screenshots 📸
*(Add your screenshots here)*

## Project Structure 📁
```
/frontend    # React + Vite UI application
  /src
    /components  # Dashboard, Login, Navbar, etc.
    index.css    # Premium Glassmorphism styling
/backend     # FastAPI Backend
  main.py      # Entry point & routes
  models.py    # SQLAlchemy models
  schemas.py   # Pydantic validation
  crud.py      # DB operations
  auth.py      # JWT authentication logic
  ml_insights.py # Simple ML-based insights
  database.py  # SQLite config
```