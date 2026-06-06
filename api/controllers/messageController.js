// api/controllers/messageController.js

// Stockage temporaire des messages
const messages = [];

// Ajouter un message reçu par le bot
export function addMessage(from, text) {
  const msg = {
    from,
    text,
    receivedAt: new Date().toISOString()
  };
  messages.push(msg);
  console.log(`💬 Message enregistré de ${from}: ${text}`);
}

// Récupérer tous les messages (Dashboard)
export function getMessages(req, res) {
  res.json(messages);
}
