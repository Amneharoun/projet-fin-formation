const express = require("express");
const { getMedicaments, addMedicament, updateMedicament, deleteMedicament, getAlerts, alertesMedicaments, importExcel, exportExcel, upload } = require("../controllers/medicamentController");
const multer = require("multer")
const xlsx = require("xlsx");
const medicamentModel = require("../models/medicamentModel");


const router = express.Router();


// Alertes stock / péremption
router.get("/alerts", getAlerts);
router.get("/alertes", alertesMedicaments);

// CRUD Médicaments
router.get("/", getMedicaments);
router.post("/", addMedicament);
router.put("/:id", updateMedicament);
router.delete("/:id", deleteMedicament);

// Import/Export Excel
router.post("/import", upload.single("file"), importExcel);
router.get("/export", exportExcel);

module.exports = router;
