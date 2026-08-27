# AI Enterprise Simulator

## Project Objective

Create a production‑quality full‑stack web application where multiple specialized AI agents collaborate to run a simulated virtual company.

## Technology Stack

- **Frontend**: React, Vite, Tailwind CSS, JavaScript, Axios, React Router
- **Backend**: Python, FastAPI, Uvicorn
- **Database**: PostgreSQL
- **AI Layer**: Python‑based modular agent architecture (LLM integration to be added later)

## Current Architecture

The project is organized into clear, modular directories:

```
AI-Enterprise-Simulator/
├── frontend/
├── backend/
├── agents/
├── database/
├── docs/
└── README.md
```

Each layer (frontend, backend, agents) is independent and communicates via a well‑defined API.

## Folder Structure

```
frontend/
│   package.json
│   vite.config.js
│   src/
│       App.jsx
│       main.jsx
│       components/
│       pages/
│       services/
│       hooks/
│       utils/
backend/
│   requirements.txt
│   .env.example
│   app/
│       main.py
│       api/
│       models/
│       schemas/
│       services/
│       core/
agents/
│   README.md
│   core/
│   ceo/
│   market/
│   finance/
│   product/
│   marketing/
│   decision/

database/

docs/
``` 

## How to Run the Frontend

1. **Navigate to the frontend directory**
   ```
   cd frontend
   ```
2. **Install dependencies** (Node.js must be installed)
   ```
   npm install
   ```
3. **Start the development server**
   ```
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

## How to Run the Backend

1. **Navigate to the backend directory**
   ```
   cd backend
   ```
2. **Create a virtual environment and install dependencies**
   ```
   python -m venv venv
   venv\Scripts\activate   # on Windows
   pip install -r requirements.txt
   ```
3. **Run the FastAPI server**
   ```
   uvicorn app.main:app --reload
   ```
   The API will be available at `http://localhost:8000`.

## Future Development Phases

1. **Agent Implementation** – Build modular AI agents (CEO, Market Research, Finance, etc.)
2. **Database Integration** – Connect to PostgreSQL, define schemas, migrations
3. **Authentication & Authorization** – Secure API endpoints
4. **AI Integration** – Plug in LLM providers, add decision‑making logic
5. **UI Enhancements** – Dashboard, visualizations, company management UI
6. **Testing & CI/CD** – Add unit/integration tests, deployment pipelines

---

*This README provides a foundation for contributors to get the project up and running quickly.*
