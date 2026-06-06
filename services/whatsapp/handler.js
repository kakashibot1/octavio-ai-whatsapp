import { askAI } from "../ai/aiClient.js";
import { verifyCode } from "../activation/codeGenerator.js";
import { addMessage } from "../../api/controllers/messageController.js";
import { saveUserData, getUserData, trackChannelFollow, isChannelFollower } from "../memory/memoryManager.js";
import { sendChannelPromotionMessage, notifyChannelFollow, sendShareRewardMessage, isValidChannelFollowCommand } from "../channel/channelManager.js";

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

  // Vérifier si c'est une commande de suivi de chaîne
  if (isValidChannelFollowCommand(text)) {
    await notifyChannelFollow(sock, remoteJid, senderId);
    return;
  }

  // Vérifier si c'est une demande de lien de promotion
  if (text.toLowerCase().includes("promotion") || text.toLowerCase().includes("partager") || text.toLowerCase().includes("share")) {
    await sendChannelPromotionMessage(sock, remoteJid, senderId);
    saveUserData(senderId, {
      numero: senderId,
      requestedPromotion: true,
      promotionRequestedAt: new Date().toISOString()
    });
    return;
  }

  // Récupérer les données utilisateur
  const userData = getUserData(senderId);

  // Vérifier si l'utilisateur est activé avec son code
  if (!verifyCode(senderId, text) && !text.startsWith("/activate")) {
    // Si ce n'est pas un code d'activation, vérifier si l'utilisateur existe en mémoire
    if (!userData || !userData.activated) {
      console.log(`⚠️ Utilisateur ${senderId} non autorisé`);
      await sock.sendMessage(remoteJid, {
        text: "❌ Vous n'êtes pas activé. Veuillez générer un code sur notre site ou répondez avec votre code d'activation."
      });
      return;
    }
  }

  // Traiter les commandes spéciales
  if (text.startsWith("/activate")) {
    saveUserData(senderId, {
      numero: senderId,
      activated: true,
      activatedAt: new Date().toISOString()
    });
    await sock.sendMessage(remoteJid, {
      text: "✅ Vous êtes maintenant activé ! Vous pouvez discuter avec Octavio AI.\n\n💡 Tapez 'promotion' pour avoir accès aux avantages premium et partagez avec vos amis!"
    });
    return;
  }

  // Si l'utilisateur est un follower de chaîne, lui donner l'accès premium
  const isFollower = isChannelFollower(senderId);
  if (isFollower) {
    console.log(`⭐ Message premium de ${senderId}`);
  }

  // Récupère la réponse de l'IA
  const reply = await askAI(text);

  // Envoie la réponse
  await sock.sendMessage(remoteJid, { text: reply });

  // Enregistre le message et met à jour la mémoire
  addMessage(senderId, text);
  saveUserData(senderId, {
    numero: senderId,
    lastMessageAt: new Date().toISOString(),
    messageCount: (userData?.messageCount || 0) + 1,
    isChannelFollower: isFollower
  });
}
