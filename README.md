# Redis with Docker

This project runs Redis locally with Docker Compose. The Redis service uses the `redis:7-alpine` image, publishes port `6379`, and stores data in a persistent Docker volume.

## Start Redis

From the repository root, run:

```powershell
docker compose up -d redis
```

Confirm the container responds:

```powershell
docker compose exec redis redis-cli PING
```

The expected response is `PONG`. Redis is available to local applications at `redis://localhost:6379`.

## Stop Redis

```powershell
docker compose stop redis
```

To remove the container and its persisted data:

```powershell
docker compose down -v
```

> `docker compose down -v` removes the project's Docker volumes, including stored Redis data and MongoDB data.