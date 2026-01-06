import cron from "node-cron";
import { User } from "../models/user.models.js";
import { fetchJoke } from "../services/joke-service.services.js";
import { bot } from "../bot/bot.js";

const TICK = "* * * * *";

export function startScheduler() {
  console.log("⏱ Scheduler armed — tick every 60 seconds");

  cron.schedule(TICK, async () => {
    const now = new Date();

    console.log("🔁 Scheduler tick @", now.toISOString());

    const users = await User.find({ isEnabled: true });

    if (!users.length) {
      console.log("🫙 No active users");
      return;
    }

    for (const user of users) {
      try {
        const due =
          !user.lastSentAt || now - user.lastSentAt >= user.frequency * 60000;

        if (!due) continue;

        const joke = await fetchJoke();
        await bot.sendMessage(user.chatId, joke);

        user.lastSentAt = now;
        await user.save();

        console.log("📤 Delivered to", user.chatId);
      } catch (err) {
        console.error("❌ Delivery failed:", user.chatId, err.message);
      }
    }
  });
}
