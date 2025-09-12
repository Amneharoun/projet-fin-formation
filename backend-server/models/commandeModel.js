// const mongoose = require("mongoose");

// const commandeSchema = new mongoose.Schema({
//   fournisseur: { type: mongoose.Schema.Types.ObjectId, ref: "Fournisseur", required: true },
//   produits: [{ nom: String, quantite: Number }],
//   statut: { type: String, enum: ["En attente", "Livrée", "Annulée"], default: "En attente" },
//   date: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model("Commande", commandeSchema);

const mongoose = require("mongoose");

const medicamentSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  categorie: { type: String, required: true },
  stock: { type: Number, default: 0 },
  prix: { type: Number, required: true, min: 0 },
  datePeremption: { type: Date, required: true },
  code: { type: String, unique: true, required: true },
  seuilAlerte: { type: Number, default: 10, min: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Medicament", medicamentSchema);

