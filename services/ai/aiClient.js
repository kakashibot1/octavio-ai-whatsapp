import axios from "axios";

const AI_API_URL = process.env.AI_API || "https://christus-api.vercel.app/ai/gemini-proxy2?prompt=";

export async function askAI(message) {
  try {
    const response = await axios.get(`${AI_API_URL}${encodeURIComponent(message)}`, {
      timeout: 10000
    });

    if (response.data && response.data.result) {
      return `🤖 Octavio AI:\n${response.data.result}`;
    }

    return `🤖 Octavio AI:\nTu as dit: "${message}"`;
  } catch (error) {
    console.error("❌ Erreur AI:", error.message);
    return "❌ Erreur de connexion à l'IA. Réessaye plus tard.";
  }
}
