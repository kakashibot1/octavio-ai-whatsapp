// api/controllers/messageController.js

import Messages from "../../database/models/Messages.js"

// Stockage temporaire des messages
const messages = []

// Ajouter un message reçu par le bot
export function addMessage(from, text) {
  const msg = new Messages(from, text)
  messages.push(msg)
  console.log(`💬 Message reçu de ${from}: ${text}`)
}

// Récupérer tous les messages (Dashboard)
export function getMessages(req, res) {
  res.json(messages)
}
