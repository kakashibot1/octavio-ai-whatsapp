// api/routes/message.js

import express from "express"
import { getMessages } from "../controllers/messageController.js"

const router = express.Router()

// GET /messages → récupère tous les messages reçus (pour dashboard)
router.get("/", (req, res) => {
  getMessages(req, res)
})

export default router
