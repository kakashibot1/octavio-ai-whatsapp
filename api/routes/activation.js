import express from "express";
import { activateUser, getUsers } from "../controllers/activationController.js";

const router = express.Router();

// POST /activate → l'utilisateur envoie son numéro et reçoit son code
router.post("/", (req, res) => {
  activateUser(req, res);
});

// GET /activate/users → récupérer tous les utilisateurs activés (dashboard)
router.get("/users", (req, res) => {
  getUsers(req, res);
});

export default router;
