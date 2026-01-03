import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  chatId: {
    type: String,
    unique: true,
    required: true,
  },
  isEnabled: {
    type: Boolean,
    default: true,
  },
  frequency: {
    type: Number,
    default: 1,
    min: 1,
    max: 60,
  },
  lastSentAt: {
    type: Date,
    default: null,
  },
});

export const User = mongoose.model("User", userSchema);
