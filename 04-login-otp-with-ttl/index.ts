import "dotenv/config";
import express from "express";
import Redis from "ioredis";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

const redisUrl = process.env.REDIS_URL as string | undefined;
const redis = new Redis(redisUrl || "redis://localhost:6379");

// Function to generate the Redis key for storing OTPs
function otpKey(phone: string) {
  return `otp:${phone}`;
}

app.post("/otp", async (req, res) => {
  const phone = req.body.phone as string | undefined;
  if (!phone) {
    return res.status(400).json({ message: "Phone number is required" });
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
  await redis.set(otpKey(phone), otp, "EX", 30); // Set the OTP with a TTL of 30 seconds
  res.json({ message: "OTP sent successfully", otp });
});

// Real-world applications should not return the OTP in the response. It is returned here for demonstration purposes only.
// {
// "phone": "1234567890",
// "otp": "483921",
// "attempts": "0",
// "maxAttempts": "3",
// "createdAt": "timestamp",
// "lastAttemptAt": "timestamp",
// "blockedUntil": "timestamp" // optional
// }

app.post("/otp/verify", async (req, res) => {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
        return res.status(400).json({ message: "Phone number and OTP are required" });
    }
    const storedOtp = await redis.get(otpKey(phone));
    if (!storedOtp) {
        return res.status(400).json({ message: "OTP has expired or does not exist" });
    }
    if (storedOtp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
    } 
    await redis.del(otpKey(phone));
    res.json({ message: "OTP verified successfully" });
});

app.get("/otp/:phone/ttl", async (req, res) => {
    const ttl = await redis.ttl(otpKey(req.params.phone));
    if (ttl === -2) {
        return res.status(404).json({ message: "OTP does not exist" });
    }
    res.json({ ttl });
});

app.listen(3000, () => {
  console.log("Server is running on port http://localhost:3000");
});