# Customer Review NLP — React Frontend

A modern, responsive React interface for the **Customer Review NLP Sentiment Analysis System**. Built with React 19, Vite, Lucide Icons, and Canvas Confetti, communicating with the FastAPI backend.

---

## 🌟 Key Features

1. **Single Review Sentiment Analysis**:
   - Real-time text analysis with character and word counters.
   - Quick one-click sample presets (Positive, Neutral, Negative, Mixed).
   - High-impact sentiment badges with expressive icons and color themes.
   - Confidence percentage meter.
   - Class probability breakdown across **Positive**, **Neutral**, and **Negative**.
   - **spaCy NLP Preprocessing Inspector**: Displays cleaned and lemmatized tokens with negation preservation.
   - **Real-Time Business Alert Badge**: Shows instant Telegram notification status for negative customer feedback.
   - Interactive celebratory confetti burst on high-confidence positive reviews.
   - Keyboard shortcut support (`Ctrl + Enter` / `Cmd + Enter`).

2. **Batch Classification & CSV Processing**:
   - Paste multi-line reviews or upload `.csv` and `.txt` files.
   - Automatic column detection for CSV headers.
   - High-speed batch inference.
   - Summary metrics (Total Processed, % Positive, % Neutral, % Negative).
   - Filterable & searchable interactive results table.
   - 1-click **Export Results to CSV** with confidence scores and cleaned tokens.

3. **Session Analytics & History**:
   - Running counters for Total Analyzed, Positive %, Neutral %, Negative %, and Alerts Triggered.
   - LocalStorage-backed review history with 1-click reload and clear.

4. **Live Backend Connectivity Monitor**:
   - Real-time status indicator (🟢 Connected / 🔴 Offline).
   - Backend URL configuration drawer (default: `http://127.0.0.1:8000`).

---

## 🚀 Getting Started

### 1. Start the Backend (FastAPI)

Open a terminal and run:

```bash
cd Backend
uvicorn src.api.app:app --reload --port 8000
```

> **API Docs**: Once started, interactive Swagger UI is available at `http://127.0.0.1:8000/docs`.

### 2. Start the Frontend (React + Vite)

Open a separate terminal and run:

```bash
cd frontend
pnpm dev
# or: npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 🏗️ Architecture & Integration

- **Backend**: FastAPI with Scikit-Learn `TfidfVectorizer` + `LogisticRegression`, `spaCy` text cleaner, and non-blocking asynchronous Telegram webhook alerts.
- **Frontend**: React 19, Vite 8, Lucide React icons, Canvas Confetti.
- **Communication**: REST API with CORS support + Vite dev server proxy (`/api`).
