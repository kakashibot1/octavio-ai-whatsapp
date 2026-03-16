// services/whatsapp/handler.js

import { askAI } from "../ai/aiClient.js"

// Fonction qui gère les messages entrants
export async function handleMessage(sock, msg) {

  const from = msg.key.remoteJid

  // Ignore les groupes
  const isGroup = from.endsWith("@g.us")
  if (isGroup) return

  // Récupère le texte du message
  let text =
    msg.message?.conversation ||
    msg.message?.extendedTextMessage?.text

  if (!text) return

  // Appelle l'IA pour obtenir la réponse
  const reply = await askAI(text)

  // Envoie la réponse sur WhatsApp
  await sock.sendMessage(from, {
    text: reply + "\n\n— Octavio AI 🤖"
  })
}
