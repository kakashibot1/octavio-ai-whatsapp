// services/ai/aiClient.js

import axios from "axios"
import config from "../../config/config.js"

// Envoie un prompt à l'API IA et récupère la réponse
export async function askAI(prompt){
  try {
    const res = await axios.get(
      config.AI_API + encodeURIComponent(prompt)
    )
    // Retourne le résultat ou un message d'erreur
    return res.data.result || "Je n'ai pas de réponse."
  } catch (error) {
    console.error("Erreur API IA :", error.message)
    return "Erreur IA Octavio"
  }
}
