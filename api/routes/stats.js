import express from "express";
import { getMemoryStats, getAllUsers, getChannelFollowers, getSharedLinks } from "../memory/memoryManager.js";
import { getChannelStats } from "../channel/channelManager.js";

const router = express.Router();

// GET /api/stats → récupère les statistiques globales
router.get("/", (req, res) => {
  const stats = {
    memory: getMemoryStats(),
    channel: getChannelStats(),
    users: getAllUsers(),
    followers: getChannelFollowers(),
    sharedLinks: getSharedLinks(),
    timestamp: new Date().toISOString()
  };
  res.json(stats);
});

// GET /api/stats/memory → récupère les stats mémoire
router.get("/memory", (req, res) => {
  res.json(getMemoryStats());
});

// GET /api/stats/channel → récupère les stats de la chaîne
router.get("/channel", (req, res) => {
  res.json({
    stats: getChannelStats(),
    followers: getChannelFollowers(),
    sharedLinks: getSharedLinks()
  });
});

// GET /api/stats/users → récupère la liste des utilisateurs
router.get("/users", (req, res) => {
  res.json(getAllUsers());
});

export default router;
