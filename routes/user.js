// Importer Express et Mongoose
const express = require("express");
const mongoose = require("mongoose");

// Importer uid2, SHA256 et encBase64 pour générer token, hasher et encoder
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

// Importer modèle User
const User = require("../models/User");

// Initialisation du routeur pour gérer les routes liées aux utilisateurs
const router = express.Router();

// Route POST pour inscription
router.post("/signup", async (req, res) => {
  console.log("Démarrage de l'inscription");

  try {
    const { username, email, password } = req.body; // Extraction des données envoyées dans le body
    console.log("Données reçues pour l'inscription :", req.body);

    // Vérif des champs requis
    if (!username) {
      return res
        .status(400)
        .json({ message: "Merci de renseigner un nom d'utilisateur" });
    }
    if (!email) {
      return res.status(400).json({ message: "Merci de renseigner un email" });
    }
    if (!password) {
      return res
        .status(400)
        .json({ message: "Merci de renseigner un mot de passe" });
    }

    // Vérif si mail existe dans BDD
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "L'adresse mail est déjà utilisée" });
    }

    // Génération du salt et hashage du mdp
    const salt = uid2(16);
    const hash = SHA256(password + salt).toString(encBase64);

    // Génération du token
    const token = uid2(64);

    // Création nouvel utilisateur
    const newUser = new User({
      email,
      account: { username },
      token,
      hash,
      salt,
    });

    // Sauvegarde dans BDD
    await newUser.save();

    // Envoi réponse avec infos de l'utilisateur
    res.status(201).json({
      user: {
        email: newUser.email,
        account: newUser.account,
        token: newUser.token,
      },
    });
  } catch (error) {
    // Si erreur -> message d'erreur
    res.status(500).json({ message: error.message });
  }
});

// Route POST pour connexion
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body; // Extraction des données envoyées pour la connexion
    // Vérif des champs requis
    if (!email) {
      return res.status(400).json({ message: "Merci de renseigner un email" });
    }
    if (!password) {
      return res
        .status(400)
        .json({ message: "Merci de renseigner un mot de passe" });
    }

    // Trouver utilisateur dans BDD
    const userFound = await User.findOne({ email });

    // Si aucun utilisateur trouvé -> message d'erreur
    if (!userFound) {
      return res.status(401).json({ message: "Utilisateur non trouvé" });
    }

    // Vérif mdp
    const newHash = SHA256(password + userFound.salt).toString(encBase64);

    // Si hachages ne correspondent pas -> message d'erreur
    if (newHash !== userFound.hash) {
      // Si hachages ne correspondent pas -> message d'erreur
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    // Si authentification réussie -> envoi infos utilisateur
    res.status(200).json({
      _id: userFound._id,
      token: userFound.token,
      account: {
        username: userFound.account.username,
      },
    });
  } catch (error) {
    // Si erreur -> message d'erreur
    res.status(500).json({ message: error.message });
  }
});

// Exporter routeur
module.exports = router;
