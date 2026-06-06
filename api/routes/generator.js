// api/routes/generator.js
// Routes pour générer sites, images, vidéos, code, etc.

import express from "express";
import { generateWebsite, generateImage, modifyImage, generateVideo, generateCode, createWebApp, getDeploymentInfo } from "../../services/ai/advancedAI.js";

const router = express.Router();

// POST /api/generator/website - Générer un site web
router.post("/website", async (req, res) => {
  try {
    const { description, numero } = req.body;
    if (!description) return res.status(400).json({ error: "Description requise" });
    
    const result = await generateWebsite(description, numero || "demo");
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/generator/image - Générer une image
router.post("/image", async (req, res) => {
  try {
    const { description, numero } = req.body;
    if (!description) return res.status(400).json({ error: "Description requise" });
    
    const result = await generateImage(description, numero || "demo");
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/generator/image/modify - Modifier une image
router.post("/image/modify", async (req, res) => {
  try {
    const { imageUrl, modification, numero } = req.body;
    if (!imageUrl || !modification) return res.status(400).json({ error: "URL et modification requises" });
    
    const result = await modifyImage(imageUrl, modification, numero || "demo");
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/generator/video - Générer une vidéo
router.post("/video", async (req, res) => {
  try {
    const { description, duration, numero } = req.body;
    if (!description) return res.status(400).json({ error: "Description requise" });
    
    const result = await generateVideo(description, duration || 30, numero || "demo");
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/generator/code - Générer du code
router.post("/code", async (req, res) => {
  try {
    const { description, language, numero } = req.body;
    if (!description) return res.status(400).json({ error: "Description requise" });
    
    const result = await generateCode(description, language || "javascript", numero || "demo");
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/generator/app - Créer une app web
router.post("/app", async (req, res) => {
  try {
    const { appType, features, numero } = req.body;
    if (!appType) return res.status(400).json({ error: "Type d'app requis" });
    
    const result = await createWebApp(appType, features || "", numero || "demo");
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/generator/info - Infos de déploiement
router.get("/info", (req, res) => {
  res.json(getDeploymentInfo());
});

export default router;
