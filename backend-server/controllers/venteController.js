const Vente = require("../models/venteModel");
const Medicament = require("../models/medicamentModel");

// Créer une nouvelle vente avec déduction automatique du stock
exports.creerVente = async (req, res) => {
  try {
    const { medicaments, ...venteData } = req.body;
    
    // Vérifier le stock disponible pour chaque médicament
    for (const item of medicaments) {
      const medicament = await Medicament.findById(item.medicament);
      if (!medicament) {
        return res.status(404).json({ 
          message: `Médicament non trouvé: ${item.medicament}` 
        });
      }
      
      if (medicament.stock < item.quantite) {
        return res.status(400).json({ 
          message: `Stock insuffisant pour ${medicament.nom}. Stock disponible: ${medicament.stock}` 
        });
      }
    }
    
    // Créer la vente
    const vente = new Vente({ ...venteData, medicaments });
    const savedVente = await vente.save();
    
    // Déduire le stock pour chaque médicament vendu
    for (const item of medicaments) {
      await Medicament.findByIdAndUpdate(
        item.medicament,
        { $inc: { stock: -item.quantite } }
      );
    }
    
    res.status(201).json(savedVente);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtenir toutes les ventes
exports.getVentes = async (req, res) => {
  try {
    const ventes = await Vente.find()
      .populate("client")
      .populate("medicaments.medicament")
      .sort({ dateVente: -1 });
    res.json(ventes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir une vente par ID
exports.getVenteById = async (req, res) => {
  try {
    const vente = await Vente.findById(req.params.id)
      .populate("client")
      .populate("medicaments.medicament");
    if (!vente) {
      return res.status(404).json({ message: "Vente non trouvée" });
    }
    res.json(vente);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
