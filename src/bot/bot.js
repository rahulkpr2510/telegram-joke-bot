import TelegramBot from "node-telegram-bot-api";
import { User } from "../models/user.models.js";
import dotenv from "dotenv";
dotenv.config();

export const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {
  polling: true,
});

bot.onText(/\/start/, async (msg) => {
  await User.findOneAndUpdate({ chatId: msg.chat.id }, {}, { upsert: true });
  bot.sendMessage(msg.chat.id, "Subscribed. Send SET <minutes> to configure.");
});

bot.on("message", async (msg) => {
  const text = msg.text?.toUpperCase();
  const chatId = msg.chat.id;

  if (text === "ENABLE") {
    await User.updateOne({ chatId }, { isEnabled: true });
    return bot.sendMessage(chatId, "Jokes resumed.");
  }

  if (text === "DISABLE") {
    await User.updateOne({ chatId }, { isEnabled: false });
    return bot.sendMessage(chatId, "Jokes paused.");
  }

  if (text?.startsWith("SET")) {
    const n = Number(text.split(" ")[1]);
    if (!n || n < 1 || n > 60) {
      return bot.sendMessage(chatId, "SET <minutes> (1–60)");
    }
    await User.updateOne({ chatId }, { frequency: n });
    return bot.sendMessage(chatId, `Frequency set to ${n} min.`);
  }
});
