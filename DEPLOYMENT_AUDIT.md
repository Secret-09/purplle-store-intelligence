# Deployment Audit

## 1. What is already implemented

- `docker-compose.yml`
  - Defines the primary deployment stack with `postgres`, `backend`, and `dashboard` services.
  - Uses environment variables for `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `DATABASE_URL`, and `VITE_API_BASE`.
  - Persists Postgres data with a named volume `postgres_data`.
  - Exposes the backend on port `8000` and the dashboard on port `4173`.

- `docker/Dockerfile.backend`
  - Builds from `python:3.12-slim`.
  - Installs Python dependencies from `requirements.txt`.
  - Copies repository contents into `/app`.
  - Sets a non-root `app` user and changes ownership of `/app`.
  - Exposes port `8000` and runs `docker/backend-entrypoint.sh`.

- `docker/Dockerfile.dashboard`
  - Uses a multi-stage build with `node:20-alpine` for frontend build and `nginx:stable-alpine` for serving static files.
  - Installs frontend dependencies and builds the React/Vite dashboard.
  - Supports the build-time argument `VITE_API_BASE`.
  - Serves the static dashboard from Nginx.

- `docker/backend-entrypoint.sh`
  - Waits for the database to become available up to 30 seconds.
  - Runs `Base.metadata.create_all(bind=engine)` to create any missing database tables at startup.
  - Starts the FastAPI app with `uvicorn`.

- `docker/nginx.conf`
  - Configures Nginx to serve the dashboard SPA from `/usr/share/nginx/html`.
  - Uses fallback routing (`try_files`) for client-side routing.

## 2. What is missing

- Robust production readiness features:
  - no `healthcheck` configured for services in `docker-compose.yml`
  - no explicit readiness probe for the backend beyond startup script behavior
  - no separate build context optimization for backend image; it copies the entire repository
  - no runtime dashboard API injection strategy; `VITE_API_BASE` is baked in at build time

- CI/CD and orchestration configuration:
  - no deployment manifests for Kubernetes, ECS, or other cloud platforms
  - no automated CI pipeline or build validation for Docker artifacts

- Secrets and environment controls:
  - no dedicated production secret handling beyond `.env` style variables
  - no distinct production vs. development compose variants

- Image optimization and reproducibility:
  - frontend build uses `npm install` instead of `npm ci` if a lockfile exists
  - backend image still copies the entire repo, including files not required at runtime

- Service readiness and ordering:
  - `depends_on` does not guarantee backend readiness for the dashboard
  - database startup ordering is implicit only; the backend script retries but does not surface readiness

## 3. Whether the deployment is production-ready

- The current deployment artifacts are not production-ready.
- They are adequate for local development and basic containerized validation, but they lack deployment-grade requirements such as:
  - health and readiness checks
  - secrets management
  - build reproducibility and image optimization
  - multi-environment configuration
  - cloud/platform-specific manifests

## 4. Any critical blockers

- Absence of service health/readiness guarantees in `docker-compose.yml`.
- Dashboard API URL configuration is static at build time, making runtime environment changes difficult.
- Backend startup depends on a database availability script, but there is no externally visible readiness probe for orchestration.
- The backend Docker build copies the full repository, increasing image size and potentially including unnecessary files.
- No CI/CD process exists to validate Docker builds, making deployment drift and regressions harder to catch.

## 5. Estimated deployment readiness score out of 100

- Score: **45 / 100**

Rationale:
- Base containerization exists and the stack is defined, which is a strong starting point.
- Core services are wired together in compose, but the deployment lacks production robustness, optimization, and orchestration readiness.
- The current artifacts are closer to developer/developer-preview deployment than hardened production deployment.
