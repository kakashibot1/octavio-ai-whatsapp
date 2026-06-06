// services/memory/memoryManager.js
// Gère la mémoire en cache pour stocker les données utilisateurs

const userMemory = new Map();
const channelFollowers = new Map();
const sharedLinks = new Map();

// Structure: userMemory[numeroWhatsApp] = { code, activated, sharedAt, followedAt, etc }

export function saveUserData(numero, data) {
  const existingData = userMemory.get(numero) || {};
  userMemory.set(numero, { ...existingData, ...data, updatedAt: new Date().toISOString() });
  console.log(`💾 Données utilisateur ${numero} sauvegardées`);
}

export function getUserData(numero) {
  return userMemory.get(numero) || null;
}

export function getAllUsers() {
  return Array.from(userMemory.entries()).map(([numero, data]) => ({
    numero,
    ...data
  }));
}

export function trackChannelFollow(numero) {
  const timestamp = new Date().toISOString();
  channelFollowers.set(numero, {
    numero,
    followedAt: timestamp,
    active: true
  });
  console.log(`📢 ${numero} suit maintenant la chaîne`);
}

export function trackLinkShare(numero) {
  const timestamp = new Date().toISOString();
  const existing = sharedLinks.get(numero) || { count: 0 };
  sharedLinks.set(numero, {
    numero,
    lastSharedAt: timestamp,
    count: existing.count + 1
  });
  console.log(`🔗 ${numero} a partagé le lien (${existing.count + 1} fois)`);
}

export function getChannelFollowers() {
  return Array.from(channelFollowers.values());
}

export function getSharedLinks() {
  return Array.from(sharedLinks.values());
}

export function isChannelFollower(numero) {
  return channelFollowers.has(numero) && channelFollowers.get(numero).active;
}

export function isLinkShared(numero) {
  return sharedLinks.has(numero);
}

// Réinitialiser la mémoire (optionnel)
export function clearMemory() {
  userMemory.clear();
  channelFollowers.clear();
  sharedLinks.clear();
  console.log("🗑️ Mémoire vidée");
}

export function getMemoryStats() {
  return {
    totalUsers: userMemory.size,
    channelFollowers: channelFollowers.size,
    sharedLinks: sharedLinks.size,
    timestamp: new Date().toISOString()
  };
}
