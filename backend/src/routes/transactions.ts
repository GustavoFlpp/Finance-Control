//backend/src/routes/transactions.ts

import express from "express";
import { AuthRequest, authMiddleware } from "../middlewares/auth";
import { Transaction } from "../models/Transaction";

const router = express.Router();

// POST /api/transactions -> cria uma nova transação
router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;
    const { name, value, category, date } = req.body;

    if (!name || value === undefined)
      return res.status(400).json({ error: "Name and value are required" });

    const transaction = new Transaction({
      userId,
      name,
      value,
      category: category || "Outros",
      date: date ? new Date(date) : new Date(),
    });

    await transaction.save();
    return res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create transaction" });
  }
});

// GET /api/transactions  -> retorna apenas do user
router.get("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;
    const transactions = await Transaction.find({ userId }).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

// PUT /api/transactions/:id
router.put("/:id", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const updateData = req.body;

    // update only if belongs to user
    const updatedTransaction = await Transaction.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedTransaction)
      return res.status(404).json({ error: "Transaction not found" });
    return res.json(updatedTransaction);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update transaction" });
  }
});

// DELETE /api/transactions/:id
router.delete("/:id", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const deletedTransaction = await Transaction.findOneAndDelete({
      _id: id,
      userId,
    });
    if (!deletedTransaction)
      return res.status(404).json({ error: "Transaction not found" });

    return res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete transaction" });
  }
});

export default router;
