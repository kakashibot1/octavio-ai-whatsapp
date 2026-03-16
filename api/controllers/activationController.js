// api/controllers/activationController.js

import { generateCodeForNumber } from "../../services/activation/codeGenerator.js"
import User from "../../database/models/User.js"

// Ici on peut stocker les utilisateurs activés en mémoire (pour l'instant)
const users = []

export function activateUser(req, res) {
  const { numero } = req.body
  if (!numero) return res.status(400).json({ error: "Numéro requis" })

  // Générer le code alphanumérique
  const code = generateCodeForNumber(numero)

  // Créer un utilisateur
  const user = new User(numero, code)
  users.push(user)

  res.json({
    numero: user.numero,
    code: user.code,
    activatedAt: user.activatedAt
  })
}

// Pour récupérer tous les utilisateurs activés (Dashboard)
export function getUsers(req, res) {
  res.json(users)
}
