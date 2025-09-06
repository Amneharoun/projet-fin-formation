const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRouter = require("./routers/authRouter");
const medicamentRouter = require("./routers/medicamentRouter");
const venteRouter = require("./routers/venteRouter");
const dashbordRoute = require("./routers/dashbord");
const clientRouter = require("./routers/clientRouter");
const commandeRouter = require("./routers/commandeRouter");

const corsOption = {
  origin: 'http://localhost:5173/'
}

const app = express();
app.use(cors());
app.use(express.json());

// Connexion MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connecté à MongoDB"))
  .catch((err) => console.error("Erreur MongoDB :", err));

// Routes
app.use("/auth", authRouter);
app.use("/medicaments", medicamentRouter);
app.use("/vente", venteRouter);
app.use("/dashboard", dashbordRoute);
app.use("/clients", clientRouter);
app.use("/commandes", commandeRouter);




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));
