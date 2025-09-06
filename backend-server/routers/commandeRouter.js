const express = require("express");
const router = express.Router();
const {
  creerCommande,
  getCommandes,
  getCommandeById,
  updateStatutCommande,
  deleteCommande
} = require("../controllers/commandeController");

// Routes CRUD pour commandes
router.post("/", creerCommande);
router.get("/", getCommandes);
router.get("/:id", getCommandeById);
router.put("/:id/statut", updateStatutCommande);
router.delete("/:id", deleteCommande);

module.exports = router;
