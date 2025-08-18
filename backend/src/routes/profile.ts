//backend/src/routes/profile.ts

import express from "express";
import { authMiddleware, AuthRequest } from "../middlewares/auth";

const router = express.Router();

router.get("/", authMiddleware, (req: AuthRequest, res) => {
  if (!req.user)
    return res.status(401).json({ error: "User not authenticated" });

  res.json({
    message: "Perfil do usuário autenticado",
    user: req.user,
  });
});

export default router;
