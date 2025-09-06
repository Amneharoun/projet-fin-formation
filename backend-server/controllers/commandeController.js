const Commande = require("../models/commandeModel");
const Fournisseur = require("../models/fournisserModel");

// Créer une nouvelle commande
exports.creerCommande = async (req, res) => {
  try {
    const commande = new Commande(req.body);
    const savedCommande = await commande.save();
    res.status(201).json(savedCommande);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtenir toutes les commandes
exports.getCommandes = async (req, res) => {
  try {
    const commandes = await Commande.find().populate("fournisseur");
    res.json(commandes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir une commande par ID
exports.getCommandeById = async (req, res) => {
  try {
    const commande = await Commande.findById(req.params.id).populate("fournisseur");
    if (!commande) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }
    res.json(commande);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour le statut d'une commande
exports.updateStatutCommande = async (req, res) => {
  try {
    const { statut } = req.body;
    const commande = await Commande.findByIdAndUpdate(
      req.params.id,
      { statut },
      { new: true }
    ).populate("fournisseur");
    
    if (!commande) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }
    res.json(commande);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer une commande
exports.deleteCommande = async (req, res) => {
  try {
    const commande = await Commande.findByIdAndDelete(req.params.id);
    if (!commande) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }
    res.json({ message: "Commande supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
