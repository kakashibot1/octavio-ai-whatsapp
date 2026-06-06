import { askAI } from "../ai/aiClient.js";
import { verifyCode } from "../activation/codeGenerator.js";
import { addMessage } from "../../api/controllers/messageController.js";

export async function handleMessage(sock, m) {
  const msg = m.messages[0];

  // Ignore les messages envoyés par le bot lui-même
  if (!msg.message || msg.key.fromMe) return;

  const remoteJid = msg.key.remoteJid;
  const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
  const senderId = remoteJid.split("@")[0];

  // Ignore les messages de groupes (ne réagit qu'aux messages privés)
  if (remoteJid.endsWith("@g.us")) {
    console.log(`📵 Message de groupe ignoré de ${senderId}`);
    return;
  }

  console.log(`📩 Message reçu de ${senderId}: ${text}`);

  // Vérifie si l'utilisateur est activé avec son code
  if (!verifyCode(senderId, text) && !text.startsWith("/activate")) {
    console.log(`⚠️ Utilisateur ${senderId} non autorisé`);
    await sock.sendMessage(remoteJid, {
      text: "❌ Vous n'êtes pas activé. Veuillez générer un code sur notre site."
    });
    return;
  }

  // Traite les commandes spéciales
  if (text.startsWith("/activate")) {
    await sock.sendMessage(remoteJid, {
      text: "✅ Vous êtes maintenant activé ! Vous pouvez discuter avec Octavio AI."
    });
    return;
  }

  // Récupère la réponse de l'IA
  const reply = await askAI(text);

  // Envoie la réponse
  await sock.sendMessage(remoteJid, { text: reply });

  // Enregistre le message
  addMessage(senderId, text);
}
