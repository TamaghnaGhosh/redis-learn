# Connect Redis and MongoDB with Node.js

The sample in [`02-setup-local-redis`](../02-setup-local-redis/README.md) connects to Redis with `ioredis` and MongoDB with Mongoose. Use these commands from the repository root.

## Start the services

```powershell
docker compose up -d redis mongo
```

## Configure and run the Node.js app

The sample defaults to `redis://localhost:6379`. Set `MONGO_URL` to the MongoDB server URI; the app adds the `redis-learn` database name.

```powershell
cd .\02-setup-local-redis
pnpm install
$env:MONGO_URL = "mongodb://localhost:27017"
pnpm dev
```

Use Node.js 22.6 or newer, which supports the type-stripping flag used by the `dev` script. To connect to different Redis or MongoDB hosts, set `REDIS_URL` and `MONGO_URL` to their corresponding server URIs before starting the app.

## Verify the connections

In another PowerShell window:

```powershell
Invoke-RestMethod http://localhost:3000/redis
Invoke-RestMethod http://localhost:3000/mongo
```

The Redis endpoint returns a `PONG` response. The MongoDB endpoint returns a connected status and the database name.

You can also ping Redis directly through the container:

```powershell
docker compose exec redis redis-cli PING
```