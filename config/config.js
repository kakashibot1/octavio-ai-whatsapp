import dotenv from "dotenv"

dotenv.config()

export default {
  PORT: process.env.PORT || 3000,
  AI_API: "https://christus-api.vercel.app/ai/gemini-proxy2?prompt="
    }
