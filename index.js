// Importer Express pour créer le serveur
const express = require("express");
// Importer Mongoose pour interagir avec la base de données
const mongoose = require("mongoose");
// Importer CORS pour gérer les requêtes externes
const cors = require("cors");
// Importer dotenv pour gérer les variables d'environnement
require("dotenv").config();

// Configuration de Cloudinary
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Création du serveur
const app = express();

// Utilisation d'express.json pour récupérer des body dans les routes
app.use(express.json());

// Utilisation de cors
app.use(cors());

// Connexion à la base de données MongoDB
mongoose.connect(process.env.MONGO_URI);

// Importer les routers
const userRouter = require("./routes/user");
const taskRouter = require("./routes/task");

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
app.use("/task", taskRouter);

// Créer une route pour gérer toutes les routes inconnues
app.all("*", (req, res) => {
  res.status(404).json({ message: "Route introuvable" });
});

// Faire tourner le serveur
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Serveur démarré 🗒️`);
});
