// services/channel/channelManager.js
// Gère la promotion de la chaîne WhatsApp et les récompenses

import { saveUserData, trackChannelFollow, trackLinkShare, isChannelFollower } from "../memory/memoryManager.js";

const CHANNEL_URL = "https://whatsapp.com/channel/0029Vb7kLyxBfxo0jhjWZ60f";
const CHANNEL_ID = "0029Vb7kLyxBfxo0jhjWZ60f";

export function getChannelPromotionMessage() {
  return `
🎉 **OCTAVIO AI SANS LIMITE** 🎉

Profitez de OCTAVIO AI sans limite en suivant notre chaîne WhatsApp officielle !

🔗 **Lien de la chaîne:**
${CHANNEL_URL}

✅ **Avantages:**
• Accès illimité à l'IA
• Mises à jour exclusives
• Support prioritaire
• Fonctionnalités premium

📢 Partagez le lien avec vos amis et recevez des récompenses !

👥 Chaque ami qui suivra la chaîne = Bonus dans votre compte
  `;
}

export function getChannelInviteText(numero) {
  trackLinkShare(numero);
  return `
🚀 **Rejoignez OCTAVIO AI SANS LIMITE!**

${CHANNEL_URL}

💡 Mon ami(e) a partagé l'accès à OCTAVIO AI - une IA puissante et sans limite!

✨ En suivant cette chaîne, vous obtiendrez:
• Réponses IA instantanées
• Support 24/7
• Fonctionnalités avancées
• Bonus et récompenses

Clique le lien et rejoins la communauté! 🎯
  `;
}

export async function sendChannelPromotionMessage(sock, remoteJid, numero) {
  try {
    const message = getChannelPromotionMessage();
    await sock.sendMessage(remoteJid, { text: message });
    console.log(`📢 Message de promotion envoyé à ${numero}`);
  } catch (error) {
    console.error(`❌ Erreur lors de l'envoi du message de promotion:`, error.message);
  }
}

export async function notifyChannelFollow(sock, remoteJid, numero) {
  try {
    trackChannelFollow(numero);
    const confirmationMessage = `
✅ **Bienvenue dans la communauté OCTAVIO AI!**

🎉 Merci d'avoir suivi notre chaîne WhatsApp!

Vous pouvez maintenant:
• 🤖 Utiliser OCTAVIO AI sans limite
• 📊 Accéder à tous les outils premium
• 💰 Cumuler des points bonus
• 🎁 Recevoir des récompenses exclusives

🚀 Commencez à discuter avec moi maintenant!
    `;
    
    await sock.sendMessage(remoteJid, { text: confirmationMessage });
    console.log(`✅ Notification de suivi envoyée à ${numero}`);
    
    // Sauvegarder les données
    saveUserData(numero, {
      numero,
      channelFollower: true,
      followedAt: new Date().toISOString(),
      bonusPoints: 100
    });
  } catch (error) {
    console.error(`❌ Erreur lors de l'envoi de la notification:`, error.message);
  }
}

export async function sendShareRewardMessage(sock, remoteJid, numero, friendName) {
  try {
    const rewardMessage = `
🎁 **NOUVELLE RÉCOMPENSE!**

${friendName} a suivi la chaîne grâce à votre partage! 🎉

💎 **+50 points bonus** ont été ajoutés à votre compte!

Vous avez maintenant partagé X fois. Plus vous partagez, plus vous gagnez! 💰

📈 Bonus totaux: ${50} points
    `;
    
    await sock.sendMessage(remoteJid, { text: rewardMessage });
    console.log(`🎁 Message de récompense envoyé à ${numero}`);
  } catch (error) {
    console.error(`❌ Erreur lors de l'envoi de la récompense:`, error.message);
  }
}

export function isValidChannelFollowCommand(text) {
  const keywords = ["suivi", "suivre", "channel", "joined", "join", "chaîne"];
  return keywords.some(keyword => text.toLowerCase().includes(keyword));
}

export function getChannelStats() {
  return {
    channelUrl: CHANNEL_URL,
    channelId: CHANNEL_ID,
    timestamp: new Date().toISOString()
  };
}
