# RepoRadar

A smarter GitHub repository explorer. Search, filter, and analyze repositories with metrics that the official GitHub search doesn't expose — health scores, activity trends, contributor counts, and side-by-side comparisons.

> 🚧 **Active development** — see [CHANGELOG](./CHANGELOG.md) for progress.

---

## Motivation

GitHub's built-in search is limited. RepoRadar lets you find repositories by combining filters that matter: language, stars, last commit date, open issue ratio, license, and more — all in one place.

---

## Features

- **Smart search** — Filter by language, stars, forks, last activity, and license
- **Health score** — Composite metric based on commit frequency, issue ratio, and contributor count *(Sprint 2)*
- **Repo comparison** — Compare up to 3 repositories side by side *(Sprint 2)*
- **Redis cache** — Results cached to avoid GitHub API rate limits *(Sprint 1)*

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| State | Zustand |
| Backend | Python, FastAPI |
| Cache | Redis |
| External API | GitHub REST API v3 |
| Deploy | Vercel + Railway |

---

## Getting Started

### Prerequisites

- Node.js 20+
- Python 3.11+
- Redis

### Setup

```bash
git clone https://github.com/tu-usuario/reporadar.git
cd reporadar

# Backend
cd server
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload

# Frontend
cd ../client
npm install
cp .env.example .env
npm run dev
```

The app runs on:
- Frontend → `http://localhost:5173`
- Backend → `http://localhost:8000`
- API Docs → `http://localhost:8000/docs`

---

## Project Structure

```
reporadar/
├── client/               # React app (Vite)
│   └── src/
│       ├── components/   # UI, search, repo components
│       ├── pages/        # Route-level pages
│       ├── store/        # Zustand global state
│       └── lib/          # Axios instance, utilities
├── server/               # FastAPI REST API
│   └── app/
│       ├── routers/      # Route definitions
│       ├── services/     # Business logic
│       ├── models/       # Pydantic schemas
│       └── core/         # Config, cache, dependencies
└── docs/                 # Architecture and sprint docs
```

---

## API Reference

```
GET  /api/search          Search repositories
GET  /api/repos/{owner}/{repo}   Get repository details
GET  /api/health          Health check
```

*(More endpoints added in Sprint 2)*

---

## Roadmap

- [x] Project setup and GitHub search
- [ ] Health score and repo analysis
- [ ] Side-by-side repo comparison
- [ ] Deploy

---

## License

MIT
