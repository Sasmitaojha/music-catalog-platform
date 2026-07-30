# SoundPulse - Music Catalog Insights Platform

> A full-stack web application for searching public music catalogs (iTunes API proxy), curating personal music libraries, visualizing catalog analytics, and generating AI-driven catalog insights.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Focus Choice Rationale](#focus-choice-rationale)
3. [Technology Stack](#technology-stack)
4. [Database & Schema Design](#database--schema-design)
5. [REST API Documentation](#rest-api-documentation)
6. [AI Feature Details](#ai-feature-details)
7. [Local Setup & Running Guide](#local-setup--running-guide)
8. [Docker & Live Deployment Guide](#docker--live-deployment-guide)
9. [Trade-offs & Technical Decisions](#trade-offs--technical-decisions)

---

## Project Overview
Streaming platforms need a seamless way to allow users to build personal music libraries sourced from a public catalog, accompanied by rich visual analytics and AI-driven recommendations.

**SoundPulse** satisfies all assignment expectations:
- **Public Catalog Proxy**: Proxies iTunes Search API (`https://itunes.apple.com/search`) with term debouncing and entity filters.
- **Personal Library Storage**: User-authenticated storage with personal ratings (1-5 stars) and custom critique notes.
- **Analytics Dashboard**: 4+ interactive visual charts (Releases by Year timeline, Genre Donut chart, Ratings Breakdown, Track Count Histogram, Top Artists Leaderboard) + KPI cards.
- **Generative AI Engine**: AI Smart Recommendations, Natural Language Querying, and Catalog Trend Summaries.
- **JWT Security & Validation**: Standardized error handling, input validation, BCrypt password hashing, and stateless JWT sessions.

---

## Focus Choice Rationale
- **Chosen Entity**: **Albums**
- **Justification**:
  - Albums offer multi-dimensional metadata (release date across decades, track counts, primary genres, cover artwork, and catalog IDs).
  - Albums allow for deeper analytics (e.g. tracking release timeline trends, track count distributions per album, and average user curation ratings) compared to standalone single songs or artist profiles.

---

## Technology Stack

### Backend
- **Language & Framework**: Java 17, Spring Boot 3.3.4
- **Security & Auth**: Spring Security, JJWT (`io.jsonwebtoken`), BCrypt Password Encoding
- **Data & Persistence**: Spring Data JPA, H2 (In-Memory default for zero-config run) / PostgreSQL
- **Build Tool**: Gradle 9.5 (`./gradlew`)
- **Testing**: JUnit 5, Mockito

### Frontend
- **Framework & Tooling**: React 18, Vite
- **Styling**: Vanilla CSS with custom glassmorphism tokens, dark theme gradients, and responsive layouts
- **Icons & HTTP**: Lucide Icons (`lucide-react`), Axios (`axios`) with JWT request interceptors

---

## Database & Schema Design

### Entity: `users`
| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PRIMARY KEY, AUTO_INC | Unique User ID |
| `username` | VARCHAR(255) | NOT NULL, UNIQUE | User Login Name |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | User Email |
| `password` | VARCHAR(255) | NOT NULL | BCrypt Password Hash |
| `created_at` | TIMESTAMP | NOT NULL | Account Registration Timestamp |

### Entity: `saved_albums`
| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PRIMARY KEY, AUTO_INC | Unique Saved Entry ID |
| `apple_catalog_id`| BIGINT | NOT NULL | iTunes Collection ID |
| `title` | VARCHAR(255) | NOT NULL | Album Title |
| `artist_name` | VARCHAR(255) | NOT NULL | Artist Name |
| `genre` | VARCHAR(255) | NULLABLE | Primary Genre |
| `release_date` | VARCHAR(255) | NULLABLE | ISO Release Date / Year |
| `track_count` | INTEGER | NULLABLE | Total Track Count |
| `artwork_url` | VARCHAR(1000) | NULLABLE | Album Cover Image URL |
| `user_rating` | INTEGER | NULLABLE (1-5) | User Curation Rating |
| `user_notes` | TEXT | NULLABLE | User Personal Critique / Notes |
| `user_id` | BIGINT | FOREIGN KEY (`users.id`) | Foreign Key to User |
| `created_at` | TIMESTAMP | NOT NULL | Entry Saved Timestamp |
| `updated_at` | TIMESTAMP | NOT NULL | Entry Updated Timestamp |

*Unique Constraint*: `(user_id, apple_catalog_id)` ensures a user cannot add duplicate album entries to their library.

---

## REST API Documentation

### Public Endpoints
- `POST /api/auth/register`: Register new user (`username`, `email`, `password`)
- `POST /api/auth/login`: Authenticate user and receive JWT bearer token
- `GET /api/search?query={term}&type={entity}&limit=25`: Proxy iTunes Search API

### Protected Endpoints (Requires `Authorization: Bearer <token>`)
- `GET /api/library`: Fetch user saved albums (Supports `search`, `genre`, `minRating`, `sortBy`, `sortDir`, `page`, `size`)
- `POST /api/library`: Save album to library (`appleCatalogId`, `title`, `artistName`, `genre`, `releaseDate`, `trackCount`, `artworkUrl`, `userRating`, `userNotes`)
- `PUT /api/library/{id}`: Update rating and notes for saved entry
- `DELETE /api/library/{id}`: Remove album entry from library
- `GET /api/analytics`: Fetch metrics and chart data series
- `POST /api/ai/insights`: Generate AI recommendations, natural language queries, or trend summaries

---

## AI Feature Details
The application includes **3 AI Insights Modes**:
1. **Smart AI Recommendations**: Analyzes the user's saved library (dominant genre, top-rated artists, track depth) and returns tailored album suggestions with explanatory rationale.
2. **Natural Language Query**: Allows users to search their library using plain English prompts (e.g., *"Show my 5 star rock albums"*, *"Top rated albums with high track count"*).
3. **Catalog Trend Summary**: Generates an automated executive summary and profile critique of the user's music collecting habits.

---

## Local Setup & Running Guide

### Prerequisites
- Java 17 SDK installed
- Node.js v18+ and npm installed

### 1. Run Backend
```bash
cd backend
./gradlew.bat bootRun
```
Backend will start on `http://localhost:8080`.
H2 Web Console available at `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:musicdb`, Username: `sa`, Password: `password`).

### 2. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend will start on `http://localhost:5173`.

### 3. Run Backend Unit Tests
```bash
cd backend
./gradlew.bat test
```

---

## Docker & Live Deployment Guide

### One-Click Local Orchestration
```bash
docker-compose up --build
```
This boots up:
- PostgreSQL database container on port `5432`
- Spring Boot backend container on port `8080`
- React Frontend container (Nginx) on port `3000`

### Local Development Override
For local development with live reload, use:
```bash
docker-compose -f docker-compose.yml -f docker-compose.override.yml up --build
```
This starts:
- backend in `bootRun` mode on port `8080`
- frontend Vite dev server on port `5173`

### Deploying to Render / Railway / Vercel
1. **Backend (Render / Railway)**:
   - Deploy `backend/` as Docker service or Java Web Service.
   - Set Environment Variables: `SPRING_PROFILES_ACTIVE=prod`, `SPRING_DATASOURCE_URL=jdbc:postgresql://...`, `JWT_SECRET=...`.
2. **Frontend (Vercel / Netlify)**:
   - Connect repository and select `frontend/` directory.
   - Build command: `npm run build`, Output directory: `dist`.

---

## Trade-offs & Technical Decisions

1. **H2 vs PostgreSQL**:
   - *Decision*: H2 in-memory DB used by default for zero-configuration developer experience out of the box, with full PostgreSQL driver and `application-prod.properties` provided for production environments.
2. **Custom SVG Visual Charts vs Recharts/Chart.js**:
   - *Decision*: Implemented clean SVG chart rendering for high performance, zero external package vulnerabilities, precise glassmorphic styling, and seamless responsive design across all viewports.
3. **State Management**:
   - *Decision*: React Context (`AuthContext`) combined with state lifting for library data to keep bundle lightweight and fast without Redux overhead.

   ---

   ## Quick API & Deployment Notes

   - Backend runs by default on `http://localhost:8080` and exposes the API under `/api`.

   - Important endpoints:
      - `POST /api/auth/register` — Register new user (body: `username`, `email`, `password`) → returns JWT.
      - `POST /api/auth/login` — Login (body: `username`, `password`) → returns JWT.
      - `GET /api/search?query=...&type=album&limit=25` — Proxy to iTunes Search API.
      - `GET /api/library` — Get authenticated user's library (supports filtering & pagination).
      - `POST /api/library` — Save album to library (authenticated).
      - `PUT /api/library/{id}` — Update rating/notes (authenticated).
      - `DELETE /api/library/{id}` — Remove saved album (authenticated).
      - `GET /api/analytics` — Returns analytics payload for charts.
      - `POST /api/ai/insights` — Generate AI recommendations / summaries from saved library.

   - Frontend expects the backend base URL in the env var `VITE_API_URL` (defaults to `http://localhost:8080/api`).

   - Deployment tips:
      - Backend: Render or Railway — supply a managed Postgres DB and set `APP_JWT_SECRET` (32+ chars) and `SPRING_DATASOURCE_URL`/credentials.
      - Frontend: Vercel or Netlify — set `VITE_API_URL` to your deployed backend's `/api` base.
      - DB: Use Supabase or managed Postgres for production; update `application-prod.properties` with connection details.

   If you want, I can add a small `.env.example` and a `deploy.md` with step-by-step Render/Vercel instructions.
