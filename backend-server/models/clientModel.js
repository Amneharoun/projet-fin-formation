const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  contact: String,
  historiqueAchats: [
    {
      medicament: { type: mongoose.Schema.Types.ObjectId, ref: "medicaments" },
      date: { type: Date, default: Date.now },
      quantite: Number
    }
  ]
});

module.exports = mongoose.model("Client", clientSchema);
