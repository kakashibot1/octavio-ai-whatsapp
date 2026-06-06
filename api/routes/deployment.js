import express from "express";
import { deployWebsite, getDeployedSites, getSiteDetails, removeSite, getDeploymentStats, getSitesDirectory } from "../../services/deployment/deploymentManager.js";
import fs from "fs-extra";
import path from "path";

const router = express.Router();

// POST /api/deployment/deploy - Déployer un site
router.post("/deploy", async (req, res) => {
  try {
    const { description, numero, name } = req.body;
    if (!description) return res.status(400).json({ error: "Description requise" });
    
    const userData = { name: name || "Utilisateur" };
    const result = await deployWebsite(description, numero || "demo", userData);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/deployment/sites - Lister les sites d'un utilisateur
router.get("/sites/:numero", (req, res) => {
  try {
    const result = getDeployedSites(req.params.numero);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/deployment/site/:siteName - Détails d'un site
router.get("/site/:siteName", (req, res) => {
  try {
    const result = getSiteDetails(req.params.siteName);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/deployment/site/:siteName - Supprimer un site
router.delete("/site/:siteName", (req, res) => {
  try {
    const result = removeSite(req.params.siteName);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/deployment/stats - Statistiques de déploiement
router.get("/stats", (req, res) => {
  try {
    const result = getDeploymentStats();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/deployment/all - Lister tous les sites déployés
router.get("/all", (req, res) => {
  try {
    const result = getDeployedSites();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
