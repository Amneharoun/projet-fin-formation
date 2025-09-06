const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddelware");
const overview = require("../controllers/dashboardController");

router.use(authMiddleware([]))
// Route pour récupérer les données du dashboard
router.get("/overview",overview);

module.exports = router;





