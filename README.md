# Telegram Joke Bot

A scalable, production-ready Telegram bot that automatically sends random jokes to users at configurable intervals.  
Built as a persistent background job engine with MongoDB-backed scheduling and fault-isolated delivery.

This is not a demo bot — it is a real notification delivery service using Telegram as the UI layer.

---

## Features

• Automatic joke delivery  
• Per-user configurable frequency  
• Pause and resume delivery  
• Persistent scheduling across restarts  
• MongoDB-backed user state  
• Input validation and fault isolation  
• Cron-based background scheduler

---

## Tech Stack

Node.js  
Express  
MongoDB (Mongoose)  
Telegram Bot API  
node-cron  
Axios

---

## Folder Structure

```
src/
├ bot/           # Telegram command router
├ jobs/          # Background scheduler
├ models/        # MongoDB models
├ services/      # External API integrations
└ server.js      # App entry point
```

---

## Setup

### 1. Clone

```bash
git clone https://github.com/rahulkpr2510/telegram-joke-bot.git
cd telegram-joke-bot
npm install
```

### 2. Create .env

```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/edzyBot
TELEGRAM_TOKEN=<your_bot_token>
```

### Run

```
npm run dev
```

### Expected output:

```
MongoDB connected
Server running on port 5000
```

## Bot Commands

Command Description
/start Subscribe user
SET n Set joke frequency in minutes (1–60)
ENABLE Resume joke delivery
DISABLE Pause joke delivery

## Test Workflow

    1.	Start the server
    2.	Open Telegram and send /start
    3.	Wait 1 minute → receive joke
    4.	Send SET 3 → jokes every 3 minutes
    5.	Send DISABLE → stop delivery
    6.	Send ENABLE → resume
    7.	Restart server → schedule persists

## Prompts Used

All LLM prompts used during development are documented in prompts.md as required by the submission.

## Why This Architecture?

The bot is designed as a background job orchestration service with Telegram as the UI.
It ensures fault isolation, restart-safe scheduling, and clean state persistence — making it scalable beyond jokes into reminders, notifications, and learning systems.
