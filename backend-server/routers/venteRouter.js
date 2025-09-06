const express = require("express");
const router = express.Router();
const { creerVente, getVentes, getVenteById } = require("../controllers/venteController");

// Routes pour les ventes
router.get("/", getVentes);
router.post("/", creerVente);
router.get("/:id", getVenteById);

module.exports = router;
