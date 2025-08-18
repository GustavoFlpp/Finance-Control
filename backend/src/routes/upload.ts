//backend/src/routes/upload.ts

import express from "express";
import multer from "multer";
import Papa from "papaparse";
import { Transaction } from "../models/Transaction";
import { authMiddleware, AuthRequest } from "../middlewares/auth";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/upload
router.post(
  "/",
  authMiddleware,
  upload.single("file"),
  (req: AuthRequest, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const fileContent = req.file.buffer.toString("utf-8");

    Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const userId = req.user!.userId;
          const transactions = results.data.map((item: any) => ({
            userId,
            name: item.Nome || item.name,
            value: parseFloat(
              (item.Valor || item.value || "0").toString().replace(",", ".")
            ),
            category: item.Categoria || item.category || "Uncategorized",
            date: item.Data ? new Date(item.Data) : undefined,
          }));

          const savedTransactions = await Transaction.insertMany(transactions);
          res.json({
            insertedCount: savedTransactions.length,
            transactions: savedTransactions,
          });
        } catch (error) {
          res.status(500).json({ error: "Failed to save transactions" });
        }
      },
      error: (error) => {
        res.status(500).json({ error: error.message });
      },
    });
  }
);

export default router;
