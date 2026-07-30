# SoundPulse - Music Catalog Insights Platform

> A full-stack web application for searching public music catalogs (iTunes API proxy), curating personal music libraries, visualizing catalog analytics, and generating AI-driven catalog insights.

---

## 🔗 Live Deployment Links
- **Live Frontend Application (Vercel):** [https://music-catalog-platform-5lo4.vercel.app](https://music-catalog-platform-5lo4.vercel.app)
- **Live Backend API (Render):** [https://music-catalog-backend-zwrx.onrender.com](https://music-catalog-backend-zwrx.onrender.com)
- **GitHub Repository:** [https://github.com/Sasmitaojha/music-catalog-platform](https://github.com/Sasmitaojha/music-catalog-platform)

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
- **Data & Persistence**: Spring Data JPA, H2 (In-Memory default) / PostgreSQL (Production)
- **Build Tool**: Gradle (`./gradlew`)
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
./gradlew bootRun
