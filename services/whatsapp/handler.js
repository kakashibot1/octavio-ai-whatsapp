import { askAI } from "../ai/aiClient.js";
import { verifyCode } from "../activation/codeGenerator.js";
import { addMessage } from "../../api/controllers/messageController.js";
import { saveUserData, getUserData, trackChannelFollow, isChannelFollower } from "../memory/memoryManager.js";
import { sendChannelPromotionMessage, notifyChannelFollow } from "../channel/channelManager.js";
import { deployWebsite, getDeployedSites, getSiteDetails } from "../deployment/deploymentManager.js";

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
  if (text.toLowerCase().includes("suivi") || text.toLowerCase().includes("suivre") || text.toLowerCase().includes("join")) {
    await notifyChannelFollow(sock, remoteJid, senderId);
    return;
  }

  // Vérifier si c'est une demande de lien de promotion
  if (text.toLowerCase().includes("promotion") || text.toLowerCase().includes("partager")) {
    await sendChannelPromotionMessage(sock, remoteJid, senderId);
    saveUserData(senderId, {
      numero: senderId,
      requestedPromotion: true,
      promotionRequestedAt: new Date().toISOString()
    });
    return;
  }

  // ============================================================
  // NOUVELLE FONCTIONNALITÉ: DÉPLOIEMENT DE SITES WEB
  // ============================================================

  // Déployer un site web avec nom personnalisé
  if (text.toLowerCase().startsWith("site:") || text.toLowerCase().startsWith("créer site:") || text.toLowerCase().startsWith("portfolio:")) {
    const description = text.split(":").slice(1).join(":").trim();
    
    if (!description) {
      await sock.sendMessage(remoteJid, {
        text: "⚠️ Veuillez spécifier le type de site.\nExemple: 'site: mon portfolio programmeur'"
      });
      return;
    }

    // Avertir l'utilisateur du démarrage
    await sock.sendMessage(remoteJid, {
      text: `⏳ Déploiement du site: "${description}"...\n🛠️ Création des fichiers...\n💾 Stockage...\n🚀 Mise en ligne...`
    });

    try {
      // Récupérer les données utilisateur
      const userData = getUserData(senderId) || {};
      
      // Déployer le site
      const deployResult = await deployWebsite(description, senderId, userData);

      if (deployResult.success) {
        // Message de confirmation avec les liens
        const deploymentMessage = `
✅ **SITE WEB DÉPLOYÉ AVEC SUCCÈS!**

🌗 **Nom du site:** ${deployResult.siteName}
📚 **Description:** ${description}

🔗 **URLs de déploiement:**
🌐 Lien local: ${deployResult.localUrl}
🚀 Production: ${deployResult.productionUrl}

📄 Votre site est prêt et accessible maintenant!
💫 Partagez le lien avec qui vous voulez!
🌟 Créé par Octavio AI
        `;

        await sock.sendMessage(remoteJid, { text: deploymentMessage });

        // Sauvegarder les données de l'utilisateur
        const deployedSites = (userData.deployedSites || []);
        deployedSites.push({
          name: deployResult.siteName,
          description,
          url: deployResult.localUrl,
          deployedAt: deployResult.deployedAt
        });

        saveUserData(senderId, {
          numero: senderId,
          deployedSites,
          lastDeployment: deployResult.deployedAt
        });
      } else {
        await sock.sendMessage(remoteJid, {
          text: `❌ Erreur de déploiement: ${deployResult.error}`
        });
      }
    } catch (error) {
      console.error("❌ Erreur déploiement:", error);
      await sock.sendMessage(remoteJid, {
        text: `❌ Erreur: ${error.message}`
      });
    }
    return;
  }

  // Lister les sites déployés
  if (text.toLowerCase().includes("mes sites") || text.toLowerCase().includes("sites deploy")) {
    try {
      const sitesData = getDeployedSites(senderId);
      
      if (sitesData.sites.length === 0) {
        await sock.sendMessage(remoteJid, {
          text: "📄 Vous n'avez pas encore de sites déployés.\n\nTapez: site: votre portfolio pour en créer un!"
        });
      } else {
        let sitesMessage = `🌐 **VOS SITES DÉPLOYÉS** (${sitesData.totalSites})\n\n`;
        
        sitesData.sites.forEach((site, i) => {
          sitesMessage += `${i + 1}. **${site.name}**\n✅ Status: ${site.status}\n🔗 ${site.localUrl}\n\n`;
        });
        
        await sock.sendMessage(remoteJid, { text: sitesMessage });
      }
    } catch (error) {
      await sock.sendMessage(remoteJid, {
        text: `❌ Erreur: ${error.message}`
      });
    }
    return;
  }

  // Vérifier l'activation
  const userData = getUserData(senderId);

  if (!verifyCode(senderId, text) && !text.startsWith("/activate")) {
    if (!userData || !userData.activated) {
      console.log(`⚠️ Utilisateur ${senderId} non autorisé`);
      await sock.sendMessage(remoteJid, {
        text: "❌ Vous n'êtes pas activé. Veuillez générer un code sur notre site ou répondez avec votre code d'activation."
      });
      return;
    }
  }

  // Commande d'activation
  if (text.startsWith("/activate")) {
    saveUserData(senderId, {
      numero: senderId,
      activated: true,
      activatedAt: new Date().toISOString()
    });
    await sock.sendMessage(remoteJid, {
      text: `✅ **Bienvenue sur Octavio AI!**\n\n🚀 **Commandes disponibles:**\n\n🌗 **Déploiement:**\n• site: [description] - Créer un site (ex: site: mon portfolio programmeur)\n• mes sites - Voir vos sites déployés\n\n💡 **Plus de fonctionnalités:**\n• image: [description] - Générer une image\n• code: [langage] [description] - Générer du code\n• promotion - Récompenses\n\nCommencez maintenant!"`
    });
    return;
  }

  // Répondre avec l'IA pour les autres messages
  const isFollower = isChannelFollower(senderId);
  const reply = await askAI(text);
  await sock.sendMessage(remoteJid, { text: reply });

  // Enregistrer et mettre à jour
  addMessage(senderId, text);
  saveUserData(senderId, {
    numero: senderId,
    lastMessageAt: new Date().toISOString(),
    messageCount: (userData?.messageCount || 0) + 1,
    isChannelFollower: isFollower
  });
}
