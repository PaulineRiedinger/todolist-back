// Importer Express pour créer le serveur
const express = require("express");
// Importer Mongoose pour interagir avec la base de données
const mongoose = require("mongoose");
// Importer CORS pour gérer les requêtes externes
const cors = require("cors");
// Importer dotenv pour gérer les variables d'environnement
require("dotenv").config();

// Création du serveur
const app = express();

// Utilisation d'express.json pour récupérer des body dans les routes
app.use(express.json());

// Utilisation de cors
app.use(cors());

// Connexion à la base de données MongoDB
mongoose.connect("mongodb://localhost:27017/listaholic");

// Importer les routers
const userRouter = require("./routes/user");

// Créer une route GET d'accueil
app.get("/", (req, res) => {
  console.log("Route d'accueil atteinte");
  res.status(200).json({ message: "Bienvenue sur Listaholic" });
});

// Route test
app.get("/test", (req, res) => {
  console.log("Route test atteinte");
  res.status(200).json({ message: "Test réussi" });
});

// Utiliser les routers avec des chemins spécifiques
app.use("/user", userRouter);

// Créer une route pour gérer toutes les routes inconnues
app.all("*", (req, res) => {
  res.status(404).json({ message: "Route introuvable" });
});

// Faire tourner le serveur
app.listen(3000, () => {
  console.log(`Serveur démarré 🗒️`);
});
