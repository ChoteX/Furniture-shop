# Bowen Furniture Catalogue MVP

First prototype implementation based on `design.md`.

## Stack
- Frontend: React + JavaScript (Vite)
- Backend: NestJS + PostgreSQL
- Auth: JWT + RBAC (`admin`, `authorized_dealer`, `architect`, `press`)
- Storage model: Local placeholder files in repo + S3 key fields in DB

## Implemented MVP scope
- Minotti-inspired IA and nav pattern (top utility bar + mega menu + categories).
- Georgian-first bilingual UI (Georgian default, English switch).
- Modular backend domains:
  - Auth + account registration/approval
  - Catalogue/products/categories
  - Designers
  - Catalogues and downloads
  - News
  - Admin operations
- Role-based access behavior:
  - Authorized dealer: all non-admin content
  - Architect: architecture/material/product technical content
  - Press: press-only photo archive + public content
  - Admin: approvals + news/user management
- Admin panel with:
  - Approval queue (approve/reject)
  - Users list
  - Create news and publish/unpublish

## Local run
1. Start PostgreSQL:
```bash
docker compose up -d
```

2. Backend setup:
```bash
cd backend
cp .env.example .env
npm install
npm run start:dev
```

3. Frontend setup:
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

4. Open:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000/api`
- Health check: `http://localhost:3000/api/health`

## Default admin user
- Email: `admin@bowen.local`
- Password: `Admin123!@#`

Change these via `backend/.env` before non-local usage.

## Repo assets and S3 model
- Placeholder files are stored under `backend/assets`.
- DB contains `s3Key` fields so moving to real S3 signed URLs is straightforward.

## Hosting note
- This full-stack app cannot run fully on GitHub Pages (frontend-only static hosting).
- You can host frontend static build on GitHub Pages, but backend and PostgreSQL must run on a server.
- See `docs/HOSTING.md` for physical machine recommendations focused on Georgia + nearby regions.
