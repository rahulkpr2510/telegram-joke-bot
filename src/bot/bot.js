import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import { User } from "../models/user.models.js";

dotenv.config();

export const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {
  polling: true,
});

const HELP_MESSAGE = `
🤖 Joke Subscription Bot

Commands:

START – Register & subscribe
SET <minutes> – Set joke interval (1–60)
ENABLE – Resume jokes
DISABLE – Pause jokes
HELP – Show help

Examples:
SET 10
ENABLE
DISABLE
`;

const KEYBOARD = {
  reply_markup: {
    keyboard: [["ENABLE", "DISABLE"], ["SET 10", "SET 30"], ["HELP"]],
    resize_keyboard: true,
    one_time_keyboard: false,
  },
};

bot.onText(/\/start/i, async (msg) => {
  const chatId = msg.chat.id;

  let user = await User.findOne({ chatId });

  if (!user) {
    user = await User.create({
      chatId,
      isEnabled: true,
      frequency: 10,
    });

    return bot.sendMessage(
      chatId,
      `Welcome aboard 🚀\n${HELP_MESSAGE}`,
      KEYBOARD
    );
  }

  bot.sendMessage(
    chatId,
    "You're already subscribed.\n" + HELP_MESSAGE,
    KEYBOARD
  );
});

bot.on("message", async (msg) => {
  if (!msg.text) return;

  const chatId = msg.chat.id;
  const text = msg.text.trim().toUpperCase();

  if (text.startsWith("/START")) return;

  const user = await User.findOne({ chatId });

  if (!user) {
    return bot.sendMessage(chatId, "Use /start to register first.", KEYBOARD);
  }

  if (text === "HELP") {
    return bot.sendMessage(chatId, HELP_MESSAGE, KEYBOARD);
  }

  if (text === "ENABLE") {
    if (user.isEnabled) {
      return bot.sendMessage(chatId, "Already enabled 😎", KEYBOARD);
    }
    user.isEnabled = true;
    await user.save();
    return bot.sendMessage(chatId, "Jokes resumed 🚀", KEYBOARD);
  }

  if (text === "DISABLE") {
    if (!user.isEnabled) {
      return bot.sendMessage(chatId, "Already paused 💤", KEYBOARD);
    }
    user.isEnabled = false;
    await user.save();
    return bot.sendMessage(chatId, "Jokes paused ⛔", KEYBOARD);
  }

  if (text.startsWith("SET")) {
    const n = Number(text.split(" ")[1]);

    if (!n || n < 1 || n > 60) {
      return bot.sendMessage(chatId, "Usage: SET <minutes> (1–60)", KEYBOARD);
    }

    user.frequency = n;
    await user.save();
    return bot.sendMessage(
      chatId,
      `Interval updated to ${n} minutes ⏱`,
      KEYBOARD
    );
  }

  return bot.sendMessage(chatId, "Unknown command.\n" + HELP_MESSAGE, KEYBOARD);
});
