const User = require("../models/userModel");
const OtpModel = require("../models/otpModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { v4 } = require("uuid");
const generateOTP = require("../utils/generateOTP");
const transporter = require("../utils/mailTransporter");
const Vente = require("../models/venteModel");
const Medicament = require("../models/medicamentModel");
const Fournisseur = require("../models/fournisserModel");

// REGISTER avec envoi OTP
const register = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;

    // Vérifie si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    // Normaliser le rôle (toujours en minuscule)
    role = role ? role.toLowerCase() : "pharmacien";

    // Vérifie que le rôle est valide
    const validRoles = ["admin", "pharmacien", "caissier"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Rôle invalide" });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    const newUser = await User.create({
      name,
      email: email.toLowerCase(), // toujours en minuscule
      password: hashedPassword,
      role,
    });

    // Création OTP
    const otp = generateOTP();
    const otpToken = v4();

    await OtpModel.create({
      userId: newUser._id,
      otp,
      otpToken,
      purpose: "verify-email",
    });

    // Envoi Email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: newUser.email,
      subject: "Vérification de votre email",
      html: `
        <h1>Vérification Email</h1>
        <p>Voici votre code de vérification :</p>
        <h2>${otp}</h2>
        <p>Merci de le saisir dans l'application pour activer votre compte.</p>
      `,
    });

    res.status(201).send({
      message: "Utilisateur créé. Vérification email envoyée.",
      otpToken,
      user: newUser,
    });
  } catch (err) {
    console.error("Erreur Register:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};



// VERIFY OTP
const verify = async (req, res) => {
  const { otp, otpToken, purpose } = req.body;

  if (purpose !== "verify-email") {
    return res.status(422).send({ message: "Purpose invalide" });
  }

  const otpDetails = await OtpModel.findOne({ otpToken, purpose });
  if (!otpDetails) {
    return res.status(404).send({ message: "OTP introuvable" });
  }
  console.log("OTP Details", otpDetails);
  console.log("OTP", typeof(otp));
  

  if (otp != otpDetails.otp) {
    console.log("Code OTP invalide");
    
    return res.status(406).send({ message: "Code OTP invalide" });
  }

  const verifiedUser = await User.findByIdAndUpdate(
    otpDetails.userId,
    { isVerified: true },
    { new: true }
  );

  res.send({ message: "Utilisateur vérifié ", verifiedUser });
};

// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).send({ message: "Utilisateur non trouvé" });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(401).send({ message: "Identifiants incorrects" });
  }

  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );



  res.send({
    message: "Connexion réussie ",
    token,
    user,
  });
};

// Créer une vente
const creerVente = async (req, res) => {
  try {
    const { medicaments, reduction } = req.body;
    let total = 0;

    for (const item of medicaments) {
      const med = await Medicament.findById(item.medicament);
      if (!med) return res.status(404).json({ message: "Médicament introuvable" });

      if (med.stock < item.quantite) {
        return res.status(400).json({ message: `Stock insuffisant pour ${med.nom}` });
      }

      total += item.prix * item.quantite;
      const stock = med.stock - item.quantite;
      await Medicament.findByIdAndUpdate(item.medicament, { stock, new: true, },);
    }

    const vente = await Vente.create({
      medicaments,
      total: total - (reduction || 0),
      reduction: reduction || 0,
    });

    res.status(201).json(vente);
  } catch (err) {
    console.error("Erreur Vente:", err);
    res.status(500).json({ message: "Erreur serveur lors de la vente" });
  }
};

// Obtenir toutes les ventes
const getVentes = async (req, res) => {
  try {
    const ventes = await Vente.find().populate("medicaments.medicament");
    res.json(ventes);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur lors du chargement des ventes" });
  }
};


const ajouterFournisseur = async (req, res) => {
  try {
    const fournisseur = new Fournisseur(req.body);
    await fournisseur.save();
    res.status(201).json(fournisseur);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const listeFournisseurs = async (req, res) => {
  try {
    const fournisseurs = await Fournisseur.find();
    res.json(fournisseurs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, verify, login, creerVente, getVentes, listeFournisseurs, ajouterFournisseur };
