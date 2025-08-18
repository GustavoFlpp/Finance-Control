//backend/src/models/Trasaction.ts

import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  value: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  category: { type: String, default: "Uncategorized" },
});

export const Transaction = mongoose.model("Transaction", transactionSchema);
