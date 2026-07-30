# Deployment Guide — SoundPulse

This document gives concise steps to deploy the backend (Render/Railway), frontend (Vercel/Netlify), and use Supabase/Postgres for production data.

## 1) Prepare production Postgres (Supabase recommended)
- Create a Supabase project (or use managed Postgres).
- Note the connection string: `postgres://USER:PASSWORD@HOST:PORT/DBNAME`.

## 2) Backend (Render or Railway)
- Option A: Render (Web Service)
  1. Create a new Web Service, connect your repository and select the `backend/` folder.
  2. Build command: `./gradlew build` or let Render use the Dockerfile if present.
  3. Start command: `java -jar build/libs/*-boot.jar` (Render auto-detects Spring Boot in many cases).
  4. Set Environment Variables (in Render dashboard) from `.env.example`:
     - `APP_JWT_SECRET`, `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`, `OPENAI_API_KEY` (optional).
  5. Optionally set `PORT` or let platform map it.

- Option B: Railway
  1. New project -> Deploy from GitHub `backend/` folder.
  2. Set environment variables in Railway environment settings.
  3. Railway provides a DATABASE_URL — map it to `SPRING_DATASOURCE_URL`.

## 3) Frontend (Vercel)
1. Import project and set the root to the `frontend/` directory.
2. Set build command: `npm run build` and output directory: `dist`.
3. Add Environment Variable `VITE_API_URL` with your backend URL, e.g. `https://api.example.com/api`.
4. Deploy; Vercel will provide a production URL.

## 4) Using Supabase Postgres
- In Supabase GUI, create a new project and get the connection string.
- Create a database role/user and set permissions as needed.
- Use `SPRING_DATASOURCE_URL=jdbc:postgresql://...` and set username/password in environment variables.

## 5) Test the deployed endpoints
- Register a user (POST `/api/auth/register`) via curl or Postman
- Login to receive JWT (POST `/api/auth/login`) and include `Authorization: Bearer <token>` for protected endpoints.

Example curl calls:

```bash
# register
curl -X POST https://api.example.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","email":"alice@example.com","password":"securepass"}'

# login
curl -X POST https://api.example.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"securepass"}'

# search (public)
curl "https://api.example.com/api/search?query=Coldplay&type=album&limit=10"

# save to library (authenticated)
curl -X POST https://api.example.com/api/library \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"appleCatalogId":12345,"title":"Example","artistName":"Artist","artworkUrl":"https://..."}'
```

## 6) Notes & Checklist
- Ensure `APP_JWT_SECRET` is at least 32 characters.
- Switch `spring.datasource` settings in `application-prod.properties` for production JDBC URL.
- Monitor logs on your hosting provider; enable backup for production DB.
- If integrating OpenAI/Gemini, store `OPENAI_API_KEY` as a secret and set usage quotas.

## 7) Optional: Docker Compose (local)
- The repo includes `docker-compose.yml` to run local Postgres + backend + frontend. Adjust `.env` values before `docker-compose up --build`.

---
If you'd like, I can also add a `postman_collection.json` with example requests or generate a `deploy_render.md` with Render-specific screenshots and exact env mapping.
