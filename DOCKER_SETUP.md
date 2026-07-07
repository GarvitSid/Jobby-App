# Docker Setup

This project can be run with Docker Compose using three services:
- `mongo` (MongoDB)
- `backend` (Express API on port 5000)
- `frontend` (React app on port 3000)

## Prerequisites
- Docker Desktop installed and running

## Start all services
```bash
docker compose up --build
```

## Open the app
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: mongodb://localhost:27017

## Stop services
```bash
docker compose down
```

## Remove containers and named volume
```bash
docker compose down -v
```

## Rebuild after dependency changes
```bash
docker compose build --no-cache
docker compose up
```
