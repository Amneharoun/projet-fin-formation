const mongoose = require("mongoose");

const venteSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
  medicaments: [
    {
      medicament: { type: mongoose.Schema.Types.ObjectId, ref: "medicaments" },
      quantite: Number,
      prix: Number
    }
  ],
  total: Number,
  dateVente: { type: Date, default: Date.now },
  reduction: Number
});

module.exports = mongoose.model("Vente", venteSchema);
