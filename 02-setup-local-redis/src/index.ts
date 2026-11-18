import "dotenv/config";
import express from "express";
import Redis from "ioredis";
import mongoose from "mongoose";

const app = express();

const redisUrl = process.env.REDIS_URL as string | undefined;
const redis = new Redis(redisUrl || "redis://localhost:6379");

console.log({ redis: redisUrl });

app.get("/redis", async (req, res) => {
  const reply = await redis.ping();
  res.json({ redis: reply });
});

app.get("/mongo", async (req, res) => {
  const mongoUrl = (process.env.MONGO_URL + "/redis-learn") as | string | undefined;
  if (!mongoUrl) {
    return res.status(500).json({ error: "MONGO_URL is not defined" });
  }
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(mongoUrl);
  }
  res.json({ mongo: "connected", database: mongoose.connection.name });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
