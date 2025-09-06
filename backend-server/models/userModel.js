const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom est obligatoire"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "L'email est obligatoire"],
      unique: true, // éviter les doublons
      lowercase: true, // toujours stocker en minuscule
      match: [/^\S+@\S+\.\S+$/, "Email invalide"], // regex basique
    },
    password: {
      type: String,
      required: [true, "Le mot de passe est obligatoire"],
      minlength: 6, // sécurité minimale
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["admin", "pharmacien", "caissier"], // ⚠️ mets en minuscule si ton backend gère comme ça
      default: "pharmacien",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
