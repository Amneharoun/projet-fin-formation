const mongoose = require("mongoose");
// creat medicament model
// const medicamentModel = mongoose.model("medicaments", Schema);

const medicamentSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  categorie: {
    type: String,
    // enum: ["Antibiotique", "Vitamine", "Sirop", "Autre"],
    required: true
  },
  stock: {
    type: Number,
    default: 0
  },
  prix: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  datePeremption: {
    type: Date,
    required: true
  },
  code: {
    type: String,
    unique: true,
    required: true
  },
  seuilAlerte: {
    type: Number,
    default: 10, min: 0
  }, // alerte si stock < seuil
}, {
  timestamps: true
});

const medicamentModel = mongoose.model("medicaments", medicamentSchema);

module.exports = medicamentModel;


