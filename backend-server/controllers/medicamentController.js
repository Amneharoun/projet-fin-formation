const Medicament = require("../models/medicamentModel");
const multer = require("multer");
const xlsx = require("xlsx");
const path = require("path");

//  Afficher tous les médicaments (avec recherche)
const getMedicaments = async (req, res) => {
    try {
        const filter = {};
        if (req.query.nom) {
            filter.nom = new RegExp(req.query.nom, "i"); // recherche insensible à la casse
        }
        const meds = await Medicament.find(filter);
        res.json(meds);
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    } 
    
};

//  Ajouter un médicament
const addMedicament = async (req, res) => {
    const { nom, code, categorie, prix, stock, seuilAlerte, datePeremption } = req.body;
    // const medicament = req.body
    
    try {
        const newMed = await Medicament.create({ nom, code, categorie, prix, stock, seuilAlerte, datePeremption });
        // const newMed = await Medicament.create(medicament);
        console.log(newMed);

        res.json(newMed);
    } catch (err) {
        res.status(500).json({ erreur: err });
    }
};

//  Modifier un médicament
const updateMedicament = async (req, res) => {
    try {
        const updated = await Medicament.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

//  Supprimer un médicament
const deleteMedicament = async (req, res) => {
    try {
        await Medicament.findByIdAndDelete(req.params.id);
        res.json({ message: "Médicament supprimé " });
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

//  Voir les médicaments en rupture ou proches de la péremption
const getAlerts = async (req, res) => {
    try {
        const today = new Date();
        const alertMeds = await Medicament.find({
            $or: [
                { stock: { $lte: 5 } },
                { datePeremption: { $lte: new Date(today.setDate(today.getDate() + 30)) } }
            ]
        });
        res.json(alertMeds);
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Médicaments en alerte
const alertesMedicaments = async (req, res) => {
  try {
    const aujourdHui = new Date();
    const limite = new Date();
    limite.setMonth(limite.getMonth() + 1); // péremption < 1 mois

    const medicaments = await Medicament.find({
      $or: [
        { stock: { $lt: 10 } },
        { datePeremption: { $lte: limite, $gte: aujourdHui } }
      ]
    });

    res.json(medicaments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Configuration multer pour upload Excel
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// Import Excel
const importExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier fourni" });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const medicaments = [];
    for (const row of data) {
      const medicament = new Medicament({
        nom: row.nom || row.Nom,
        code: row.code || row.Code,
        categorie: row.categorie || row.Categorie,
        prix: row.prix || row.Prix,
        stock: row.stock || row.Stock || 0,
        seuilAlerte: row.seuilAlerte || row.SeuilAlerte || 10,
        datePeremption: new Date(row.datePeremption || row.DatePeremption)
      });
      medicaments.push(medicament);
    }

    await Medicament.insertMany(medicaments);
    res.json({ message: `${medicaments.length} médicaments importés avec succès` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export Excel
const exportExcel = async (req, res) => {
  try {
    const medicaments = await Medicament.find();
    const data = medicaments.map(med => ({
      Nom: med.nom,
      Code: med.code,
      Categorie: med.categorie,
      Prix: med.prix,
      Stock: med.stock,
      SeuilAlerte: med.seuilAlerte,
      DatePeremption: med.datePeremption.toISOString().split('T')[0]
    }));

    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(workbook, worksheet, "Medicaments");

    const filename = `medicaments_${Date.now()}.xlsx`;
    const filepath = path.join("uploads", filename);
    xlsx.writeFile(workbook, filepath);

    res.download(filepath, filename);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
    getMedicaments,
    getAlerts,
    addMedicament,
    updateMedicament,
    deleteMedicament,
    alertesMedicaments,
    importExcel,
    exportExcel,
    upload
};
