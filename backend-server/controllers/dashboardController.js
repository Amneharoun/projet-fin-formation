const Medicament = require("../models/medicamentModel");
const Vente = require("../models/venteModel");

const overview = async (req, res) => {
  console.log("Begin", req.originalUrl);

  try {
    const role = req.user.role;
    const today = new Date();
    const next30Days = new Date();
    next30Days.setDate(today.getDate() + 30);

    // 🔹 Médicaments avec stock faible
    const lowStockCount = await Medicament.countDocuments({ stock: { $lte: 5 } });

    // 🔹 Médicaments qui expirent dans les 30 jours
    const expiringCount = await Medicament.countDocuments({
      datePeremption: { $lte: next30Days },
    });

    // 🔹 Chiffre d'affaires des 30 derniers jours
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    const revenueData = await Vente.aggregate([
      {
        $match: {
          dateVente: { $gte: last30Days },
        },
      },
      {
        $group: { _id: null, total: { $sum: "$total" } },
      },
    ]);
    const revenue30d = revenueData.length > 0 ? revenueData[0].total : 0;

    // 🔹 Top 10 produits vendus
    const topProducts = await Vente.aggregate([
      { $unwind: "$medicaments" },
      {
        $group: {
          _id: "$medicaments.medicament",
          qty: { $sum: "$medicaments.quantite" },
        },
      },
      { $sort: { qty: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "medicaments",
          localField: "_id",
          foreignField: "_id",
          as: "medInfo"
        }
      },
      { $unwind: "$medInfo" },
      {
        $project: {
          _id: 1,
          qty: 1,
          name: "$medInfo.nom"
        }
      }
    ]);

    // Données de ventes pour le graphique
    const sales = [
      { mois: "Janvier", valeur: 100 },
      { mois: "Février", valeur: 130 },
      { mois: "Mars", valeur: 110 },
      { mois: "Avril", valeur: 105 },
      { mois: "Mai", valeur: 140 },
      { mois: "Juin", valeur: 180 },
      { mois: "Juillet", valeur: 150 },
    ];

    // Médicaments en rupture
    const medicamentsRupture = await Medicament.find({ stock: { $lte: 5 } })
      .select("nom stock")
      .limit(10);

    console.log("End", req.originalUrl);

    res.json({
      lowStockCount,
      expiringCount,
      revenue30d,
      topProducts,
      sales,
      medicamentsRupture,
      role
    });
  } catch (err) {
    console.error("Erreur Dashboard:", err);
    res.status(500).json({ message: "Erreur serveur dashboard" });
  }
}

module.exports = overview;