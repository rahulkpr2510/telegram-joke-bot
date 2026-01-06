import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import "./bot/bot.js";
import { startScheduler } from "./jobs/joke-scheduler.jobs.js";

console.clear();
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("🚀 Telegram Joke Bot – Boot Sequence");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

const REQUIRED_ENV = ["PORT", "MONGO_URI", "TELEGRAM_TOKEN"];

REQUIRED_ENV.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing environment variable: ${key}`);
    process.exit(1);
  }
});

const app = express();
app.disable("x-powered-by");

app.get("/health", (_, res) =>
  res.json({ status: "ok", uptime: process.uptime() })
);

const DB_URI = `${process.env.MONGO_URI}/telegram-bot`;

console.log("🔌 Connecting to MongoDB...");
mongoose
  .connect(DB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

console.log("⏳ Initializing scheduler...");
startScheduler();
console.log("✅ Scheduler running");

app.listen(process.env.PORT, () => {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`🌐 Server listening on port ${process.env.PORT}`);
  console.log("🤖 Bot online. System operational.");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
});
