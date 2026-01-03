import cron from "node-cron";
import { User } from "../models/user.models.js";
import { fetchJoke } from "../services/joke-service.services.js";
import { bot } from "../bot/bot.js";

export function startScheduler() {
  cron.schedule("* * * * *", async () => {
    const now = new Date();
    const users = await User.find({ isEnabled: true });

    for (const user of users) {
      try {
        if (
          !user.lastSentAt ||
          now - user.lastSentAt >= user.frequency * 60000
        ) {
          const joke = await fetchJoke();
          await bot.sendMessage(user.chatId, joke);
          user.lastSentAt = now;
          await user.save();
        }
      } catch (err) {
        console.error("Delivery failed:", user.chatId, err.message);
      }
    }
  });
}
