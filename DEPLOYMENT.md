# Deployment

This repository can be deployed locally using Docker Compose for the PostgreSQL database, FastAPI backend, and React dashboard.

## Services

- `postgres`: PostgreSQL database
- `backend`: FastAPI API server
- `dashboard`: React dashboard served by Nginx

## Getting Started

1. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

2. Build and start the stack:
   ```bash
   docker compose up --build
   ```

3. Access the services:
   - API: `http://localhost:8000`
   - Dashboard: `http://localhost:4173`

## Notes

- The backend automatically creates database tables on startup.
- The dashboard build uses `VITE_API_BASE` to point the browser to the backend API.
- If you change any backend Python dependencies or frontend assets, restart with `docker compose up --build`.

## Stopping

```bash
docker compose down
```
