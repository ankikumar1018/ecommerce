# ShopSphere — E-commerce Starter (Django + DRF + GraphQL + React)

Overview
--------
ShopSphere is a starter, API-first e-commerce platform scaffold built with Django (REST + GraphQL), JWT authentication, Celery-driven webhooks, Redis caching, and a Vite + React frontend. It is designed as a complete, runnable developer starter with tests, Docker compose orchestration, and production-minded defaults.

Key Goals
---------
- Provide both REST and GraphQL APIs for store data and orders.
- Secure authentication via JWT (djangorestframework-simplejwt).
- Event-driven integrations using Celery + RabbitMQ for webhook delivery and retries.
- Redis-backed caching for performance.
- Full React frontend (Vite) as a reference client (SPA).
- Dockerized dev environment for fast onboarding and E2E validation.

Features (chronological / detailed)
----------------------------------
1. Project scaffold
   - Django 4.2 project with apps `accounts` and `shop`.
   - Custom `accounts.User` model and auth integration.
2. API
   - DRF viewsets for product catalog, cart, checkout, and webhooks.
   - Graphene-Django GraphQL schema for product/order queries and mutations.
   - JWT auth endpoints for login/refresh.
3. Background processing
   - Celery tasks for webhook delivery and retries with RabbitMQ broker.
4. Caching and performance
   - `django-redis` integration for caching and session support.
5. Frontend
   - Vite + React SPA with pages: Products, Product details, Cart, Auth (Login/Register).
   - Context-based state (AuthContext, CartContext) and Axios API layer.
6. Dev tooling
   - pytest + pytest-django for unit tests; RUFF/formatters suggested.
   - Docker / docker-compose dev environment (db, redis, rabbitmq, web, worker, frontend).

Repository layout (high level)
-----------------------------
- `shop_sphere/` — Django project settings and WSGI/ASGI.
- `accounts/` — Custom user + auth logic.
- `shop/` — Product, Cart, Order, Webhook models and APIs.
- `frontend/` — Vite + React app with build/Docker config.
- `Dockerfile`, `docker-compose.yml` — Container orchestration for development.
- `requirements.txt` — Python dependencies.

Architecture
------------
High-level components:

- Postgres — primary relational DB for models and migrations.
- Django (Gunicorn) — REST + GraphQL API server.
- Celery worker — background tasks (webhook delivery), brokered by RabbitMQ.
- Redis — caching and optional session store.
- React SPA — user-facing frontend served via Nginx in Docker.

Mermaid diagram (high level)

```mermaid
flowchart LR
  Browser -->|HTTP| NginxFrontend[Frontend (Nginx)]
  Browser -->|REST/GraphQL| Gunicorn[API (Gunicorn / Django)]
  Gunicorn --> Postgres[(Postgres)]
  Gunicorn --> Redis[(Redis Cache)]
  Gunicorn --> RabbitMQ[(RabbitMQ)]
  RabbitMQ --> Celery[Celery Worker]
  Celery -->|webhook| External[External Webhook Endpoints]
```

Key files and links
-------------------
- Docker compose: [docker-compose.yml](docker-compose.yml)
- Django settings: [shop_sphere/settings.py](shop_sphere/settings.py)
- Accounts initial migration: [accounts/migrations/0001_initial.py](accounts/migrations/0001_initial.py)
- Frontend app: [frontend/](frontend/)

Getting started (local development)
----------------------------------
Requirements

- macOS / Linux / Windows WSL
- Docker & Docker Compose v2
- (Optional) Python 3.11+ for local venv development

Quick dev (Docker, most common)

1. Build and start the full stack (db, redis, rabbitmq, web, worker, frontend):

```bash
docker compose up --build -d
```

2. Check service health

```bash
docker compose ps
docker compose logs web --tail=200
```

3. Apply migrations (container):

```bash
docker compose exec web python manage.py migrate
docker compose exec web python manage.py createsuperuser
```

4. Open the apps

- Frontend SPA (production build): http://localhost:3000
- API: http://localhost:8000
- RabbitMQ management UI: http://localhost:15672 (guest:guest replacement in compose)

Frontend development with hot-reload (no image rebuild)
---------------------------------------------------
If you want to edit frontend files and see updates without rebuilding the Docker image, start the Vite dev server in a container that mounts your local `frontend/` source.

1. Start backend services (db, redis, rabbitmq, web):

```bash
docker compose up -d db redis rabbitmq web
```

2. Start the dev frontend (hot-reload):

```bash
docker compose up --build -d frontend-dev
```

3. Open the dev frontend in your browser:

```text
http://localhost:3000
```

Notes:
- The `frontend-dev` service mounts `./frontend` into the container and runs `npm run dev` with host 0.0.0.0 so edits are visible immediately.
- A named Docker volume `frontend_node_modules` is used to persist installed dependencies so you don't reinstall on every restart.
- `VITE_API_BASE` in the dev container defaults to `http://host.docker.internal:8000` which resolves to the host Docker daemon; adjust if using Linux or remote Docker (on Linux use `http://localhost:8000`).

Running locally (Python venv)

1. Create and activate venv

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Environment variables

Create `.env` or set env vars used by `docker-compose.yml` / Django. Example variables:

```
DJANGO_DEBUG=1
DJANGO_SECRET=unsafe-secret-for-dev
DATABASE_URL=postgres://postgres:postgres@db:5432/shopsphere
REDIS_URL=redis://redis:6379/0
CELERY_BROKER_URL=amqp://rabbit:rabbit@rabbitmq:5672//
```

3. Run migrations and dev server

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

Frontend development
--------------------
From `frontend/` folder:

```bash
cd frontend
npm install
npm run dev
# frontend dev server runs on 5173 by default; see vite config
```

To build the frontend for production use inside Docker image:

```bash
cd frontend
npm run build
```

Testing
-------
Run backend tests with pytest:

```bash
docker compose exec web pytest -q
# or locally in venv
pytest -q
```

Running lint/format (suggested)

```bash
ruff check .
# black .
```

Troubleshooting
---------------
- Migrations errors (InconsistentMigrationHistory): remove DB volume for dev and re-run migrations if you can lose data:

```bash
docker compose down -v
docker compose up --build -d
```

- If Django falls back to SQLite unexpectedly, ensure `DATABASE_URL` is set in your environment or `docker-compose.yml` for `web` and `worker`.

CI / Deployment notes
---------------------
- In CI, run `pytest` and build docker images. Use `docker compose -f docker-compose.ci.yml` for CI-specific overrides.
- For production, replace local compose with proper infra: managed Postgres, Redis, RabbitMQ (or a cloud task queue), and configure HTTPS at the proxy/load balancer.

Security
--------
- Rotate `DJANGO_SECRET` and avoid committing `.env` to git (use secrets manager).
- Use HTTPS in production and set `SECURE_SSL_REDIRECT = True`.

Contributing
------------
- Fork → feature branch → PR with clear description and tests.
- Run tests locally: `pytest` and ensure linting passes.

Useful links
------------
- Django: https://docs.djangoproject.com/
- Django REST framework: https://www.django-rest-framework.org/
- Graphene-Django: https://docs.graphene-python.org/projects/django/en/latest/
- Celery: https://docs.celeryq.dev/
- Vite: https://vitejs.dev/

License
-------
This repository is provided as-is for educational and starter purposes. Add a license file if you intend to use it commercially.

Contact
-------
For questions about the scaffold, open an issue or reach out in PR comments.
# ShopSphere — Starter

Minimal Django starter for ShopSphere with DRF + GraphQL skeleton and pytest tests.

Quick start:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
pytest -q
```

Detailed app overview
---------------------

ShopSphere is an API-first e-commerce starter featuring:

- Django + Django REST Framework for REST APIs
- Graphene-Django for GraphQL APIs
- JWT authentication via `djangorestframework-simplejwt`
- Celery + Redis for async tasks (webhook delivery retries)
- PostgreSQL recommended for production (docker-compose includes Postgres)

Project layout
- `shop/`: Django app (models, serializers, views, GraphQL schema)
- `shop_sphere/`: Django project settings
- `frontend/`: React + Vite frontend
- `docs/`: PRD and ER diagrams

Architecture
------------

High-level components:

- API backend: Django + DRF (REST) + Graphene (GraphQL)
- Auth: JWT via `djangorestframework-simplejwt` (users live in `accounts` app)
- Async: Celery (RabbitMQ broker) + Redis for cache
- DB: PostgreSQL
- Frontend: React + Vite served by Nginx in container
- Webhooks: delivery via Celery tasks with retry/backoff and DLQ

Mermaid diagram (project overview):

```mermaid
flowchart LR
	Browser -->|REST / GraphQL| Frontend[React Frontend]
	Frontend --> API[Gunicorn + Django]
	API -->|reads/writes| Postgres[(Postgres DB)]
	API -->|cache| Redis[(Redis Cache)]
	API -->|enqueue| RabbitMQ[(RabbitMQ)]
	RabbitMQ -->|consume| CeleryWorker[Celery worker]
	CeleryWorker -->|deliver| WebhookTarget[(External Webhook Consumer)]
	API -->|admin| Admin[Admin UI]
```

Updated startup & end-to-end guide
---------------------------------

Prerequisites: Docker & Docker Compose installed locally.

1) Build and start the stack (recommended detached):

```bash
docker compose up --build -d
```

This starts Postgres, Redis, RabbitMQ, backend (`web`), Celery worker (`worker`), and frontend.

2) Confirm services are healthy (wait a few seconds):

```bash
docker compose ps
docker logs -f <service-name>  # e.g. web or worker
```

3) Backend endpoints:

- API: http://localhost:8000/api/
- Admin (if enabled): http://localhost:8000/admin/
- Frontend: http://localhost:3000

4) Running database migrations locally (if you need to run manually):

```bash
docker compose exec web python manage.py migrate --noinput
```

5) Run end-to-end smoke tests (after stack is up):

- Using pytest (makes real HTTP calls through API client tests already included):

```bash
# from host, ensure virtualenv active and dependencies installed
pytest -q
```

- Or use the provided Postman collection: import `postman/ShopSphere.postman_collection.json` and set `{{base_url}}` to `http://localhost:8000`.

Troubleshooting
- If the frontend does not render, ensure `frontend` container built successfully: `docker compose logs frontend`.
- If migrations fail at startup, run `docker compose exec web python manage.py migrate` and inspect DB connectivity.
- For Celery/RabbitMQ issues, check RabbitMQ UI at http://localhost:15672 (user/password: rabbit/rabbit).

Project architecture (files)
- `shop/`: domain models, views, repositories, tests
- `accounts/`: auth `User` model and admin
- `shop_sphere/`: Django settings, ASGI/WSGI, middleware
- `frontend/`: React app with Vite and Dockerfile
- `docs/`: ER diagrams, PRD

If you want, I can add a small `make` or `scripts/` helper that performs `up`, waits for readiness, runs migrations, and then runs the Postman collection for automated end-to-end validation.

Local development (Docker)

1. Start services with Docker Compose:

```bash
docker compose up --build
```

2. The backend will be available at `http://localhost:8000` and frontend at `http://localhost:3000`.

Postman

Import `postman/ShopSphere.postman_collection.json` into Postman and set `{{base_url}}` to `http://localhost:8000`.

Running tests locally (no Docker):

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pytest -q
```

Linting

Ruff is configured in `pyproject.toml`. Run:

```bash
ruff check .
```

Next steps

- Fill expanded PRD in `docs/PRD_Expanded.md` (placeholder created)
- Add CI (GitHub Actions) to run `ruff` and `pytest` and build Docker images
- Implement payment gateway integration

Contact

If you'd like, I can: add CI, expand the PRD, or harden security (JWT rotation, token blacklist, production settings).
