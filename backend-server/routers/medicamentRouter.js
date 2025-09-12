const express = require("express");
const {
  getMedicaments,
  addMedicament,
  updateMedicament,
  deleteMedicament,
  getAlerts,
  importExcel,
  exportExcel,
  upload
} = require("../controllers/medicamentController");

const router = express.Router();

router.get("/", getMedicaments);
router.post("/", addMedicament);
router.put("/:id", updateMedicament);
router.delete("/:id", deleteMedicament);

router.get("/alerts", getAlerts);
router.post("/import", upload.single("file"), importExcel);
router.get("/export", exportExcel);

module.exports = router;
