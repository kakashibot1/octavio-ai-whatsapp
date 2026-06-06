import { askAI } from "../ai/aiClient.js";
import { verifyCode } from "../activation/codeGenerator.js";
import { addMessage } from "../../api/controllers/messageController.js";
import { saveUserData, getUserData, trackChannelFollow, isChannelFollower } from "../memory/memoryManager.js";
import { sendChannelPromotionMessage, notifyChannelFollow, sendShareRewardMessage, isValidChannelFollowCommand } from "../channel/channelManager.js";
import { generateWebsite, generateImage, modifyImage, generateVideo, generateCode, createWebApp, listGeneratedAssets } from "../ai/advancedAI.js";

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

  // NOUVELLES FONCTIONNALITÉS AVANCÉES
  // Générer un site web
  if (text.toLowerCase().startsWith("site:") || text.toLowerCase().startsWith("créer site:")) {
    const description = text.split(":")[1].trim();
    await sock.sendMessage(remoteJid, { text: "⏳ Génération de votre site web..." });
    const result = await generateWebsite(description, senderId);
    if (result.success) {
      await sock.sendMessage(remoteJid, {
        text: `✅ **Site Web Créé!**\n\n🔗 Lien: ${result.url}\n\nVotre site est prêt et accessible maintenant!`
      });
      saveUserData(senderId, { generatedWebsite: result.url });
    } else {
      await sock.sendMessage(remoteJid, { text: `❌ Erreur: ${result.error}` });
    }
    return;
  }

  // Générer une image
  if (text.toLowerCase().startsWith("image:") || text.toLowerCase().startsWith("créer image:")) {
    const description = text.split(":")[1].trim();
    await sock.sendMessage(remoteJid, { text: "🖼️ Génération de votre image..." });
    const result = await generateImage(description, senderId);
    if (result.success) {
      await sock.sendMessage(remoteJid, {
        text: `✅ **Image Générée!**\n\n🖼️ Image: ${result.url}`
      });
    }
    return;
  }

  // Générer du code
  if (text.toLowerCase().startsWith("code:")) {
    const parts = text.split(":");
    const language = parts[1]?.trim() || "javascript";
    const description = parts.slice(2).join(":").trim();
    await sock.sendMessage(remoteJid, { text: "💻 Génération de code..." });
    const result = await generateCode(description, language, senderId);
    if (result.success) {
      await sock.sendMessage(remoteJid, {
        text: `✅ **Code ${language.toUpperCase()} Généré!**\n\n📄 Fichier: ${result.url}\n\n📋 Aperçu:\n\`\`\`\n${result.preview}\n\`\`\``
      });
    }
    return;
  }

  // Créer une application web
  if (text.toLowerCase().startsWith("app:")) {
    const description = text.split(":")[1].trim();
    const appTypes = ["calculator", "todo", "portfolio", "landing"];
    let appType = "landing";
    
    for (const type of appTypes) {
      if (description.toLowerCase().includes(type)) {
        appType = type;
        break;
      }
    }
    
    await sock.sendMessage(remoteJid, { text: `📱 Création de l'app web ${appType}...` });
    const result = await createWebApp(appType, description, senderId);
    if (result.success) {
      await sock.sendMessage(remoteJid, {
        text: `✅ **App Web Créée!**\n\n📱 Type: ${appType}\n🔗 Lien: ${result.url}\n\nL'app est prêt à utiliser!`
      });
      saveUserData(senderId, { generatedApps: (getUserData(senderId)?.generatedApps || []).concat(result.url) });
    }
    return;
  }

  // Générer une vidéo
  if (text.toLowerCase().startsWith("vidéo:") || text.toLowerCase().startsWith("video:")) {
    const description = text.split(":")[1].trim();
    await sock.sendMessage(remoteJid, { text: "🎬 Génération de votre vidéo..." });
    const result = await generateVideo(description, 30, senderId);
    if (result.success) {
      await sock.sendMessage(remoteJid, {
        text: `✅ **Vidéo Générée!**\n\n🎬 Vidéo: ${result.url}\n⏱️ Durée: ${result.duration}s\n\n📝 Script:\n${result.script}`
      });
    }
    return;
  }

  // Lister les ressources générées
  if (text.toLowerCase().includes("mes ressources") || text.toLowerCase().includes("mes créations")) {
    const assets = await listGeneratedAssets(senderId);
    await sock.sendMessage(remoteJid, {
      text: `📊 **Vos Créations**\n\n📁 Ressources générées: ${assets.count}\n\n✅ Vous pouvez demander des sites, images, codes ou vidéos!`
    });
    return;
  }

  // Récupérer les données utilisateur
  const userData = getUserData(senderId);

  // Vérifier si l'utilisateur est activé avec son code
  if (!verifyCode(senderId, text) && !text.startsWith("/activate")) {
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
      text: "✅ Vous êtes maintenant activé ! Vous pouvez discuter avec Octavio AI.\n\n🚀 **Fonctionnalités Disponibles:**\n• site: [description] - Créer un site web\n• image: [description] - Générer une image\n• code: [langage] [description] - Générer du code\n• app: [type] - Créer une app web\n• vidéo: [description] - Créer une vidéo\n• mes ressources - Lister vos créations"
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
