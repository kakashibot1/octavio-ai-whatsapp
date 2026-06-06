import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import activationRouter from "./routes/activation.js";
import messageRouter from "./routes/message.js";
import statsRouter from "./routes/stats.js";
import { startBot } from "../services/whatsapp/bot.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Setup pour les chemins de fichiers (nécessaire avec ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, "../apps/web")));
app.use("/dashboard", express.static(path.join(__dirname, "../apps/dashboard")));
app.use("/api/messages", messageRouter);
app.use("/api/stats", statsRouter);

// Routes API
app.use("/activate", activationRouter);

// Route pour le dashboard
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../apps/dashboard/index.html"));
});

// Route par défaut
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../apps/web/index.html"));
});

// Démarre le serveur
app.listen(PORT, () => {
  console.log(`🚀 Octavio AI server running on http://localhost:${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard`);
  console.log(`📈 Stats: http://localhost:${PORT}/api/stats`);
});

// Démarre le bot WhatsApp
console.log("⏳ Démarrage du bot WhatsApp...");
startBot().catch(err => {
  console.error("❌ Erreur au démarrage du bot:", err.message);
});
