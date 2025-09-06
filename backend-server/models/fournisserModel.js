const mongoose = require("mongoose");

const fournisseurSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  contact: { type: String, required: true },
  produits: [{ type: String }]
});

module.exports = mongoose.model("Fournisseur", fournisseurSchema);
