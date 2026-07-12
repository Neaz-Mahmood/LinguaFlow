# 🌊 LinguaFlow

LinguaFlow is a language-learning MVP built on **polyglot methodologies** (Stephen Krashen’s Comprehensible Input, Alexander Arguelles’ Shadowing, and Benny Lewis’ Speak From Day One). It replaces the standard rote-memorization gamification loops with a sequential 15-minute **Daily Flow** path.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React + Vite (HTML5 Web Audio API, styled with premium Vanilla CSS glassmorphic components).
- **Backend**: NestJS (TypeScript framework with modular dependency injection architecture).
- **Database**: PostgreSQL (relational database managed via **TypeORM** schemas).
- **Package Management**: **pnpm** (fast, disk-space efficient package manager).
- **Infrastructure**: Docker Compose (for local database containerization).

```mermaid
graph TD
  subgraph Frontend (Port 5173)
    ReactApp[React + Vite client]
  end

  subgraph Backend (Port 8000)
    NestApp[NestJS Backend API]
    TypeORM[TypeORM service]
  end

  subgraph Database (Port 5432)
    PG[(PostgreSQL Docker)]
  end

  ReactApp --> NestApp
  NestApp --> TypeORM
  TypeORM --> PG
```

---

## 🚀 How to Run the Project

Follow these steps to launch the database, backend services, and frontend client.

### Prerequisites
Make sure you have the following installed on your machine:
- **Node.js** (v18+)
- **pnpm** (run `npm install -g pnpm` if you do not have it)
- **Docker & Docker Desktop** (running)

---

### Step 1: Start the PostgreSQL Database
We run PostgreSQL inside a lightweight Docker container. Spin it up using:
```bash
docker compose up -d
```
*This starts a database named `linguaflow` on port `5432` using username `postgres` and password `postgrespassword`.*

---

### Step 2: Run the NestJS Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies (if not already cached):
   ```bash
   pnpm install
   ```
3. Start the NestJS development server:
   ```bash
   pnpm run start
   ```
   *The backend will automatically synchronize the tables in PostgreSQL and seed them with initial Spanish stories for levels A1–B2 on its first boot. The API runs on **http://localhost:8000**.*

---

### Step 3: Run the Frontend Client
1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the Vite React development server:
   ```bash
   pnpm run dev
   ```
   *The frontend client runs on **http://localhost:5173/**.*

---

## 🧪 Verification & Testing

To run the NestJS unit test suites verifying the SuperMemo SM-2 flashcard scheduler logic, run the following command in the `backend/` directory:
```bash
pnpm test
```

---

## 🌊 The Daily Flow Engine (MVP Feature Steps)

1. **Adaptive Onboarding**: Sets up learning profiles dictating target levels (A1–B2) and commitment times.
2. **Comprehensible Input**: Displays dual-language story texts. Tapping a target word opens a glassmorphic tooltip revealing instant translations and enabling context-based **Sentence Mining** to user decks.
3. **Spaced Repetition (SRS)**: Employs the **SM-2 SuperMemo algorithm** to calculate card intervals based on recall quality scores (0–5).
4. **Shadowing Exercise**: Native TTS synthesis speaker playback. The user can record their voice using the Web Audio API or run the text-based simulator. Returns pronunciation accuracy scoring.
5. **Quick Output**: Chatbot prompt asking the user to answer questions about the story in the target language. Returns direct grammar feedback tips.
