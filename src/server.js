import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import "./bot/bot.js";
import { startScheduler } from "./jobs/joke-scheduler.jobs.js";

dotenv.config();
const app = express();

mongoose
  .connect(`${process.env.MONGO_URI}/telegram-bot`)
  .then(() => console.log("MongoDB connected"));

startScheduler();

app.listen(process.env.PORT, () =>
  console.log("Server running on port", process.env.PORT)
);
