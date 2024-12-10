// Importer Express et Mongoose
const express = require("express");
const mongoose = require("mongoose");

// Importer uid2, SHA256 et encBase64 pour générer token, hasher et encoder
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

// Importe fileUpload pour gérer téléchargement de fichiers, Cloudinary pour hébergement des images
const fileUpload = require("express-fileupload");
const { v2: cloudinary } = require("cloudinary");

// Importer modèle User
const User = require("../models/User");

// Configurer Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Initialisation du routeur pour gérer les routes liées aux utilisateurs
const router = express.Router();

// Activer fileUpload pour gérer fichiers
router.use(fileUpload());

// Fonction pour convertir et uploader un fichier
const uploadImageToCloudinary = async (file) => {
  try {
    const base64File = `data:${file.mimetype};base64,${file.data.toString(
      "base64"
    )}`;
    const result = await cloudinary.uploader.upload(base64File, {
      folder: "avatars", // Nom du dossier dans Cloudinary
    });
    return result.secure_url; // Retourne URL sécurisée
  } catch (error) {
    throw new Error("Erreur lors de l'upload de l'image.");
  }
};

// Route POST pour inscription
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérif champs requis
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    // Vérif si mail existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email déjà utilisé." });
    }

    // Générer token, hash et salt pour sécuriser mdp
    const salt = uid2(16);
    const hash = SHA256(password + salt).toString(encBase64);
    const token = uid2(64);

    // Upload avatar (si présent)
    let avatar = null;
    if (req.files?.avatar) {
      try {
        avatar = await uploadImageToCloudinary(req.files.avatar);
      } catch (error) {
        return res.status(500).json({ message: "Erreur lors de l'upload." });
      }
    }

    // Créer nouvel utilisateur
    const newUser = new User({
      email,
      account: { username, avatar },
      token,
      hash,
      salt,
    });

    await newUser.save();

    // Retourner infos utilisateur
    res.status(201).json({
      user: {
        email: newUser.email,
        account: {
          username: newUser.account.username,
          avatar: newUser.account.avatar,
        },
        token: newUser.token,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route POST pour connexion
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérif champs requis
    if (!email || !password) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    // Trouver utilisateur dans BDD
    const userFound = await User.findOne({ email });

    if (!userFound) {
      return res.status(401).json({ message: "Utilisateur non trouvé." });
    }

    // Vérif mdp
    const newHash = SHA256(password + userFound.salt).toString(encBase64);

    if (newHash !== userFound.hash) {
      return res.status(401).json({ message: "Mot de passe incorrect." });
    }

    // Répondre avec infos utilisateur
    res.status(200).json({
      _id: userFound._id,
      token: userFound.token,
      account: {
        username: userFound.account.username,
        avatar: userFound.account.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Exporter le routeur
module.exports = router;
