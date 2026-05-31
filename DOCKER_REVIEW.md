# Docker Review

This review covers the existing Docker-related files in the repository.

## Summary

- `Dockerfile.api`: MISSING
- `docker/Dockerfile.backend`: PARTIAL
- `docker/Dockerfile.dashboard`: PARTIAL
- `docker-compose.yml`: PARTIAL
- `.env.example`: COMPLETE

> Note: No `Dockerfile.api` exists in the repository. The backend service currently uses `docker/Dockerfile.backend`.

## File-by-file Review

### `Dockerfile.api`
- Status: **MISSING**
- Issue: There is no file named `Dockerfile.api` in the repository.
- Fix: Create `Dockerfile.api` or rename/alias `docker/Dockerfile.backend` to `Dockerfile.api` if the API image must be referenced by that exact name.

### `docker/Dockerfile.backend`
- Status: **PARTIAL**
- Positives:
  - Uses `python:3.12-slim` and installs dependencies from `requirements.txt`.
  - Uses an entrypoint script to run the API server.
- Issues:
  - `COPY . .` copies the entire repository into the image, increasing build context size and including files not needed at runtime.
  - There is no explicit `ENV PYTHONUNBUFFERED=1`, which is recommended for containerized Python logging.
- Fixes:
  1. Reduce build context by copying only required application files and `requirements.txt` before `COPY . .`.
  2. Add `ENV PYTHONUNBUFFERED=1` for deterministic logging.
  3. Consider adding a `HEALTHCHECK` or structured startup script if the container must report readiness.

### `docker/Dockerfile.dashboard`
- Status: **PARTIAL**
- Positives:
  - Uses a multi-stage build to keep the final image small.
  - Builds the React app and serves it from Nginx.
  - Supports a build-time `VITE_API_BASE` arg.
- Issues:
  - `npm install` is run without a lockfile; if `package-lock.json` is added, `npm ci` would improve reproducibility.
  - The static build uses `VITE_API_BASE` at build time, so runtime API target cannot be changed without rebuilding.
- Fixes:
  1. Add `package-lock.json` to the frontend repo or use `npm ci` when lockfile exists.
  2. If runtime API configuration is desired, replace the static build arg pattern with a runtime substitution approach.

### `docker-compose.yml`
- Status: **PARTIAL**
- Positives:
  - Defines `postgres`, `backend`, and `dashboard` services.
  - Uses `DATABASE_URL` and a build arg for `VITE_API_BASE`.
- Issues:
  - No health checks are configured for `postgres` or `backend`; `depends_on` alone does not guarantee readiness.
  - The frontend uses `VITE_API_BASE=http://localhost:8000`, which is correct for browser clients on the host but may not be ideal for non-local deployments.
- Fixes:
  1. Add `healthcheck` configuration for `postgres` and optionally `backend`.
  2. Change `depends_on` to use healthcheck-based startup ordering if using an older Compose version, or rely on backend startup retry logic.
  3. Document the intended value of `VITE_API_BASE` for host vs. container access.

### `.env.example`
- Status: **COMPLETE**
- Positives:
  - Includes `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `DATABASE_URL`, and `VITE_API_BASE`.
  - Provides a valid default database connection string for compose.
- Fixes: None required.
