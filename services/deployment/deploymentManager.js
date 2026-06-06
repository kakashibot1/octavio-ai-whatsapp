// services/deployment/deploymentManager.js
// Génère et déploie des sites web avec domaines personnalisés (comme Vercel/Netlify)

import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEPLOYED_SITES_DIR = path.join(__dirname, "../../deployed-sites");
const SITE_INDEX_FILE = path.join(__dirname, "../../site-registry.json");

// Configuration de domaine (utiliser un sous-domaine local ou cloud)
const DEPLOYMENT_DOMAIN = process.env.DEPLOYMENT_DOMAIN || "https://octavio-sites.vercel.app";
// Pour développement local: "http://localhost:3000/preview"
const LOCAL_DOMAIN = process.env.LOCAL_DOMAIN || "http://localhost:3000/preview";

// Créer les répertoires s'ils n'existent pas
fs.ensureDirSync(DEPLOYED_SITES_DIR);

// Initialiser le registre des sites
if (!fs.existsSync(SITE_INDEX_FILE)) {
  fs.writeJsonSync(SITE_INDEX_FILE, { sites: [], totalDeployed: 0 });
}

/**
 * Crée un nom de domaine personnalisé pour le site
 */
function generateSiteName(userInput) {
  // Nettoyer le nom : supprimer spéciaux, espaces, etc.
  const cleaned = userInput
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .substring(0, 40);
  
  // Ajouter timestamp pour l'unicité
  const timestamp = Date.now().toString().slice(-6);
  return `${cleaned}-${timestamp}`;
}

/**
 * Génère un site web professionnel
 */
function generatePortfolioHTML(name, description, skills, projects) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} - Portfolio</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f8f9fa;
        }

        header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 60px 20px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        header h1 {
            font-size: 48px;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }

        header p {
            font-size: 18px;
            opacity: 0.95;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        section {
            padding: 60px 20px;
            margin: 20px 0;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        section h2 {
            color: #667eea;
            margin-bottom: 30px;
            font-size: 32px;
            border-bottom: 3px solid #667eea;
            padding-bottom: 10px;
        }

        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 20px;
        }

        .skill-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            transition: transform 0.3s ease;
        }

        .skill-card:hover {
            transform: translateY(-5px);
        }

        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
        }

        .project-card {
            background: white;
            border: 2px solid #667eea;
            border-radius: 8px;
            padding: 20px;
            transition: all 0.3s ease;
        }

        .project-card:hover {
            box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
            transform: translateY(-5px);
        }

        .project-card h3 {
            color: #667eea;
            margin-bottom: 10px;
        }

        footer {
            background: #2c3e50;
            color: white;
            text-align: center;
            padding: 30px;
            margin-top: 40px;
        }

        .social-links {
            display: flex;
            gap: 20px;
            justify-content: center;
            margin-top: 20px;
            flex-wrap: wrap;
        }

        .social-links a {
            color: white;
            text-decoration: none;
            font-size: 20px;
            transition: color 0.3s;
        }

        .social-links a:hover {
            color: #667eea;
        }

        .deployment-badge {
            display: inline-block;
            background: #10b981;
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            font-size: 12px;
            margin-top: 10px;
            font-weight: bold;
        }

        @media (max-width: 768px) {
            header h1 {
                font-size: 32px;
            }

            section {
                padding: 30px 15px;
            }

            section h2 {
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
    <header>
        <h1>${name}</h1>
        <p>${description}</p>
        <div class="deployment-badge">
            🚀 Déployé avec Octavio AI
        </div>
    </header>

    <div class="container">
        <section id="skills">
            <h2>💻 Compétences</h2>
            <div class="skills-grid">
                ${skills.map(skill => `<div class="skill-card"><i class="fas fa-check"></i><br>${skill}</div>`).join('')}
            </div>
        </section>

        <section id="projects">
            <h2>📚 Projets</h2>
            <div class="projects-grid">
                ${projects.map((project, i) => `
                    <div class="project-card">
                        <h3>Projet ${i + 1}</h3>
                        <p>${project}</p>
                        <small>Déployé par Octavio AI</small>
                    </div>
                `).join('')}
            </div>
        </section>
    </div>

    <footer>
        <p>&copy; 2026 ${name} - Portfolio Créé par Octavio AI</p>
        <p style="margin-top: 10px; font-size: 12px; opacity: 0.8;">Technologie: Node.js + Express + IA Avancée</p>
    </footer>
</body>
</html>`;
}

/**
 * Déploie un site web avec un nom personnalisé
 */
export async function deployWebsite(userDescription, numero, userData = {}) {
  try {
    console.log(`🚀 Début du déploiement pour: ${userDescription}`);

    // Générer un nom de site personnalisé
    const siteName = generateSiteName(userDescription);
    const siteDir = path.join(DEPLOYED_SITES_DIR, siteName);
    
    // Créer le répertoire du site
    fs.ensureDirSync(siteDir);

    // Extraire les compétences et projets (exemple)
    const skills = [
      "JavaScript",
      "React",
      "Node.js",
      "MongoDB",
      "HTML/CSS",
      "Git"
    ];

    const projects = [
      "Portfolio personnel - Site web responsive",
      "API REST - Backend avec Node.js",
      "Application mobile - React Native",
      "Automatisation AI - Bot WhatsApp"
    ];

    // Générer le HTML du site
    const htmlContent = generatePortfolioHTML(
      userData.name || "Développeur",
      userDescription,
      skills,
      projects
    );

    // Sauvegarder le fichier HTML
    const indexPath = path.join(siteDir, "index.html");
    fs.writeFileSync(indexPath, htmlContent);

    // Générer les URLs de déploiement
    const localUrl = `${LOCAL_DOMAIN}/${siteName}`;
    const productionUrl = `${DEPLOYMENT_DOMAIN}/${siteName}`;

    // Enregistrer le site dans le registre
    const registry = fs.readJsonSync(SITE_INDEX_FILE);
    const siteRecord = {
      id: siteName,
      name: userDescription,
      owner: numero,
      ownerName: userData.name || "Utilisateur",
      localUrl,
      productionUrl,
      deploiedAt: new Date().toISOString(),
      htmlSize: htmlContent.length,
      status: "active"
    };

    registry.sites.push(siteRecord);
    registry.totalDeployed = registry.sites.length;
    fs.writeJsonSync(SITE_INDEX_FILE, registry, { spaces: 2 });

    console.log(`✅ Site déployé: ${siteName}`);

    return {
      success: true,
      siteName,
      siteId: siteName,
      localUrl,
      productionUrl,
      deployedAt: siteRecord.deploiedAt,
      message: `Votre site "${userDescription}" a été déployé avec succès!`
    };
  } catch (error) {
    console.error("❌ Erreur déploiement:", error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Récupérer la liste des sites déployés
 */
export function getDeployedSites(numero = null) {
  try {
    const registry = fs.readJsonSync(SITE_INDEX_FILE);
    let sites = registry.sites;

    if (numero) {
      sites = sites.filter(site => site.owner === numero);
    }

    return {
      success: true,
      totalSites: sites.length,
      sites: sites
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Récupérer les détails d'un site
 */
export function getSiteDetails(siteName) {
  try {
    const registry = fs.readJsonSync(SITE_INDEX_FILE);
    const site = registry.sites.find(s => s.id === siteName);

    if (!site) {
      return { success: false, error: "Site non trouvé" };
    }

    // Vérifier si le fichier existe
    const siteDir = path.join(DEPLOYED_SITES_DIR, siteName);
    const indexPath = path.join(siteDir, "index.html");
    const fileExists = fs.existsSync(indexPath);

    return {
      success: true,
      site: {
        ...site,
        fileExists,
        filePath: fileExists ? indexPath : null
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Supprimer un site déployé
 */
export function removeSite(siteName) {
  try {
    const registry = fs.readJsonSync(SITE_INDEX_FILE);
    const siteIndex = registry.sites.findIndex(s => s.id === siteName);

    if (siteIndex === -1) {
      return { success: false, error: "Site non trouvé" };
    }

    // Supprimer le répertoire du site
    const siteDir = path.join(DEPLOYED_SITES_DIR, siteName);
    fs.removeSync(siteDir);

    // Supprimer de l'enregistrement
    registry.sites.splice(siteIndex, 1);
    registry.totalDeployed = registry.sites.length;
    fs.writeJsonSync(SITE_INDEX_FILE, registry, { spaces: 2 });

    return {
      success: true,
      message: `Site "${siteName}" supprimé avec succès`
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Obtenir les statistiques de déploiement
 */
export function getDeploymentStats() {
  try {
    const registry = fs.readJsonSync(SITE_INDEX_FILE);

    return {
      success: true,
      stats: {
        totalDeployed: registry.totalDeployed,
        activeSites: registry.sites.filter(s => s.status === "active").length,
        totalSize: registry.sites.reduce((sum, s) => sum + (s.htmlSize || 0), 0),
        deploymentDomain: DEPLOYMENT_DOMAIN,
        localDomain: LOCAL_DOMAIN
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

export function getSitesDirectory() {
  return DEPLOYED_SITES_DIR;
}

export function getDeploymentConfig() {
  return {
    deploymentDomain: DEPLOYMENT_DOMAIN,
    localDomain: LOCAL_DOMAIN,
    sitesDirectory: DEPLOYED_SITES_DIR,
    registryFile: SITE_INDEX_FILE
  };
}
