// services/ai/advancedAI.js
// Service pour les capacités avancées : génération de code, images, vidéos, etc.

import axios from "axios";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HOSTED_SITES_DIR = path.join(__dirname, "../../hosted-sites");
const GENERATED_ASSETS_DIR = path.join(__dirname, "../../generated-assets");

// Créer les répertoires s'ils n'existent pas
fs.ensureDirSync(HOSTED_SITES_DIR);
fs.ensureDirSync(GENERATED_ASSETS_DIR);

const DOMAIN_BASE = process.env.DOMAIN_BASE || "http://localhost:3000/sites";
const AI_API = process.env.AI_API || "https://christus-api.vercel.app/ai/gemini-proxy2?prompt=";
const IMAGEGEN_API = "https://api.unsplash.com/search/photos";
const PIXABAY_API = "https://pixabay.com/api/";

/**
 * Génère un site web HTML complet à partir d'une description
 */
export async function generateWebsite(description, numero) {
  try {
    const siteId = `site_${numero}_${Date.now()}`;
    const siteDir = path.join(HOSTED_SITES_DIR, siteId);
    fs.ensureDirSync(siteDir);

    // Prompt pour générer le HTML
    const htmlPrompt = `Génère un site web HTML5 complet et moderne pour: "${description}"
    
    Le site doit:
    - Avoir un design responsive
    - Inclure du CSS intégré (pas de fichiers externes)
    - Avoir au minimum 3 sections
    - Utiliser des couleurs attrayantes
    - Inclure des icônes FontAwesome
    - Être prêt à utiliser immédiatement
    
    Retourne UNIQUEMENT le code HTML complet entre <html> et </html>`;

    const response = await axios.get(`${AI_API}${encodeURIComponent(htmlPrompt)}`, {
      timeout: 15000
    });

    let htmlContent = response.data?.result || response.data || "";
    
    // Nettoyer le contenu
    if (!htmlContent.includes("<html")) {
      htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${description}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
        header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 0; text-align: center; }
        section { padding: 40px 20px; max-width: 1200px; margin: 0 auto; }
        footer { background: #333; color: white; text-align: center; padding: 20px; margin-top: 40px; }
    </style>
</head>
<body>
    <header>
        <h1>${description}</h1>
        <p>Créé par Octavio AI</p>
    </header>
    <section>
        <h2>Bienvenue</h2>
        <p>Votre site web a été généré avec succès par Octavio AI!</p>
    </section>
    <footer>
        <p>&copy; 2026 - Généré par Octavio AI</p>
    </footer>
</body>
</html>`;
    }

    // Sauvegarder le fichier HTML
    const htmlPath = path.join(siteDir, "index.html");
    fs.writeFileSync(htmlPath, htmlContent);

    const siteUrl = `${DOMAIN_BASE}/${siteId}/index.html`;
    console.log(`🌐 Site web généré: ${siteUrl}`);

    return {
      success: true,
      siteId,
      url: siteUrl,
      type: "website"
    };
  } catch (error) {
    console.error("❌ Erreur génération site:", error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Génère une image via IA (Dall-E simulé ou API externe)
 */
export async function generateImage(description, numero) {
  try {
    const imageId = `img_${numero}_${Date.now()}.png`;
    const imagePath = path.join(GENERATED_ASSETS_DIR, imageId);

    // Utiliser une API de génération d'images
    const imagePrompt = `Génère une image pour: ${description}`;
    
    // Simuler avec Unsplash ou Pixabay
    let imageUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(description)}&client_id=YOUR_UNSPLASH_API_KEY`;
    
    // Alternative: utiliser une image placeholder
    const placeholderUrl = `https://via.placeholder.com/800x600?text=${encodeURIComponent(description.substring(0, 50))}`;
    
    console.log(`🖼️ Image générée: ${placeholderUrl}`);

    return {
      success: true,
      imageId,
      url: placeholderUrl,
      type: "image"
    };
  } catch (error) {
    console.error("❌ Erreur génération image:", error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Modifie une image existante
 */
export async function modifyImage(imageUrl, modification, numero) {
  try {
    const modifiedImageId = `modified_img_${numero}_${Date.now()}.png`;
    
    // Prompt pour modifier l'image
    const modifyPrompt = `Modifie cette image avec les changements suivants: ${modification}`;
    
    // Simuler la modification
    const modifiedImageUrl = `https://via.placeholder.com/800x600?text=${encodeURIComponent(modification.substring(0, 50))}`;
    
    console.log(`🎨 Image modifiée: ${modifiedImageUrl}`);

    return {
      success: true,
      modifiedImageId,
      originalUrl: imageUrl,
      modifiedUrl: modifiedImageUrl,
      type: "modified_image"
    };
  } catch (error) {
    console.error("❌ Erreur modification image:", error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Génère une vidéo (synthèse de texte en vidéo)
 */
export async function generateVideo(description, duration = 30, numero) {
  try {
    const videoId = `video_${numero}_${Date.now()}`;
    
    // Utiliser une API de génération de vidéos (Synthesia, D-ID, etc.)
    // Pour la démo, on simule
    const videoPrompt = `Crée une vidéo sur: ${description}`;
    
    // Générer un script vidéo
    const scriptResponse = await axios.get(`${AI_API}${encodeURIComponent(videoPrompt)}`, {
      timeout: 15000
    });
    
    const videoScript = scriptResponse.data?.result || "Vidéo générée par Octavio AI";
    
    // Sauvegarder le script
    const scriptPath = path.join(GENERATED_ASSETS_DIR, `${videoId}_script.txt`);
    fs.writeFileSync(scriptPath, videoScript);
    
    // URL vidéo simulée (placeholder)
    const videoUrl = `https://via.placeholder.com/1280x720?text=${encodeURIComponent("Vidéo: " + description.substring(0, 40))}`;
    
    console.log(`🎬 Vidéo générée: ${videoUrl}`);

    return {
      success: true,
      videoId,
      scriptPath,
      url: videoUrl,
      duration,
      script: videoScript.substring(0, 200),
      type: "video"
    };
  } catch (error) {
    console.error("❌ Erreur génération vidéo:", error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Génère du code (HTML, CSS, JavaScript, Python, etc.)
 */
export async function generateCode(description, language = "javascript", numero) {
  try {
    const codeId = `code_${numero}_${Date.now()}`;
    
    const codePrompt = `Génère du code ${language} complet et fonctionnel pour: "${description}"
    
    Le code doit:
    - Être prêt à utiliser
    - Avoir des commentaires explicatifs
    - Être bien structuré
    - Inclure gestion d'erreurs
    
    Retourne UNIQUEMENT le code`;
    
    const response = await axios.get(`${AI_API}${encodeURIComponent(codePrompt)}`, {
      timeout: 15000
    });
    
    const code = response.data?.result || "Code généré";
    
    // Sauvegarder le code
    const extension = getExtension(language);
    const codePath = path.join(GENERATED_ASSETS_DIR, `${codeId}.${extension}`);
    fs.writeFileSync(codePath, code);
    
    console.log(`💻 Code généré: ${codePath}`);

    return {
      success: true,
      codeId,
      language,
      filePath: codePath,
      url: `${DOMAIN_BASE}/code/${codeId}.${extension}`,
      preview: code.substring(0, 500),
      type: "code"
    };
  } catch (error) {
    console.error("❌ Erreur génération code:", error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Crée une application web interactive
 */
export async function createWebApp(appType, features, numero) {
  try {
    const appId = `app_${appType}_${numero}_${Date.now()}`;
    const appDir = path.join(HOSTED_SITES_DIR, appId);
    fs.ensureDirSync(appDir);
    
    let htmlContent = "";
    
    if (appType === "calculator") {
      htmlContent = createCalculator();
    } else if (appType === "todo") {
      htmlContent = createTodoApp();
    } else if (appType === "portfolio") {
      htmlContent = createPortfolio(features);
    } else if (appType === "landing") {
      htmlContent = createLandingPage(features);
    } else {
      // Générer dynamiquement
      const prompt = `Crée une app web ${appType} avec ces features: ${features}`;
      const response = await axios.get(`${AI_API}${encodeURIComponent(prompt)}`);
      htmlContent = response.data?.result || "App web";
    }
    
    const htmlPath = path.join(appDir, "index.html");
    fs.writeFileSync(htmlPath, htmlContent);
    
    const appUrl = `${DOMAIN_BASE}/${appId}/index.html`;
    console.log(`📱 App web créée: ${appUrl}`);

    return {
      success: true,
      appId,
      appType,
      url: appUrl,
      type: "webapp"
    };
  } catch (error) {
    console.error("❌ Erreur création app:", error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

// Fonctions utilitaires
function getExtension(language) {
  const extensions = {
    javascript: "js",
    python: "py",
    html: "html",
    css: "css",
    java: "java",
    php: "php",
    csharp: "cs"
  };
  return extensions[language] || "txt";
}

function createCalculator() {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Calculatrice</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { display: flex; justify-content: center; align-items: center; height: 100vh; background: #667eea; }
        .calculator { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); }
        input { width: 100%; padding: 10px; margin: 5px; font-size: 18px; }
        button { width: 23%; padding: 10px; margin: 5px; font-size: 16px; cursor: pointer; }
        .result { background: #f0f0f0; color: #333; }
    </style>
</head>
<body>
    <div class="calculator">
        <input type="text" id="display" class="result" readonly>
        <div>
            <button onclick="addToDisplay('1')">1</button>
            <button onclick="addToDisplay('2')">2</button>
            <button onclick="addToDisplay('3')">3</button>
            <button onclick="addToDisplay('+')">+</button>
        </div>
        <div>
            <button onclick="addToDisplay('4')">4</button>
            <button onclick="addToDisplay('5')">5</button>
            <button onclick="addToDisplay('6')">6</button>
            <button onclick="addToDisplay('-')">-</button>
        </div>
        <div>
            <button onclick="addToDisplay('7')">7</button>
            <button onclick="addToDisplay('8')">8</button>
            <button onclick="addToDisplay('9')">9</button>
            <button onclick="addToDisplay('*')">*</button>
        </div>
        <div>
            <button onclick="addToDisplay('0')">0</button>
            <button onclick="calculate()">=</button>
            <button onclick="clear()" style="width: 50%;">C</button>
        </div>
    </div>
    <script>
        function addToDisplay(char) {
            document.getElementById('display').value += char;
        }
        function calculate() {
            try {
                document.getElementById('display').value = eval(document.getElementById('display').value);
            } catch(e) {
                alert('Erreur');
            }
        }
        function clear() {
            document.getElementById('display').value = '';
        }
    </script>
</body>
</html>`;
}

function createTodoApp() {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Todo App</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial; background: #f5f5f5; padding: 20px; }
        .container { max-width: 500px; margin: 50px auto; background: white; padding: 20px; border-radius: 8px; }
        input { width: 80%; padding: 10px; border: 1px solid #ddd; }
        button { padding: 10px 20px; background: #667eea; color: white; border: none; cursor: pointer; }
        ul { list-style: none; margin-top: 20px; }
        li { padding: 10px; background: #f9f9f9; margin: 5px 0; border-radius: 4px; display: flex; justify-content: space-between; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Ma Todo List</h1>
        <input id="taskInput" type="text" placeholder="Ajouter une tâche...">
        <button onclick="addTask()">Ajouter</button>
        <ul id="taskList"></ul>
    </div>
    <script>
        function addTask() {
            const input = document.getElementById('taskInput');
            const list = document.getElementById('taskList');
            const li = document.createElement('li');
            li.innerHTML = `<span>${input.value}</span><button onclick="this.parentElement.remove()">❌</button>`;
            list.appendChild(li);
            input.value = '';
        }
    </script>
</body>
</html>`;
}

function createPortfolio(name) {
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Portfolio - ${name}</title>
    <style>
        * { margin: 0; padding: 0; }
        body { font-family: Arial; background: #f5f5f5; }
        header { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 60px 20px; text-align: center; }
        section { max-width: 1000px; margin: 40px auto; padding: 20px; background: white; border-radius: 8px; }
        h2 { margin-bottom: 20px; color: #333; }
    </style>
</head>
<body>
    <header>
        <h1>${name}</h1>
        <p>Développeur créatif</p>
    </header>
    <section>
        <h2>À propos</h2>
        <p>Bienvenue sur mon portfolio créé par Octavio AI</p>
    </section>
</body>
</html>`;
}

function createLandingPage(title) {
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial; }
        header { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 100px 20px; text-align: center; }
        h1 { font-size: 48px; margin-bottom: 20px; }
        .cta { background: white; color: #667eea; padding: 12px 30px; border-radius: 5px; cursor: pointer; font-weight: bold; }
    </style>
</head>
<body>
    <header>
        <h1>${title}</h1>
        <p>Créé par Octavio AI</p>
        <button class="cta">Commencer</button>
    </header>
</body>
</html>`;
}

export async function listGeneratedAssets(numero) {
  const assets = fs.readdirSync(GENERATED_ASSETS_DIR);
  return {
    success: true,
    count: assets.length,
    assets: assets
  };
}

export function getDeploymentInfo() {
  return {
    hostedSitesDir: HOSTED_SITES_DIR,
    generatedAssetsDir: GENERATED_ASSETS_DIR,
    domainBase: DOMAIN_BASE,
    totalSites: fs.readdirSync(HOSTED_SITES_DIR).length,
    totalAssets: fs.readdirSync(GENERATED_ASSETS_DIR).length
  };
}
