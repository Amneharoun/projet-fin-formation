const mongoose = require("mongoose");

const commandeSchema = new mongoose.Schema({
  fournisseur: { type: mongoose.Schema.Types.ObjectId, ref: "Fournisseur", required: true },
  produits: [{ nom: String, quantite: Number }],
  statut: { type: String, enum: ["En attente", "Livrée", "Annulée"], default: "En attente" },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Commande", commandeSchema);
