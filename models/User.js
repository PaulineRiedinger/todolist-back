// Importer mongoose
const mongoose = require("mongoose");

// Déclarer modèle mongoose User pour créer collec User dans BDD
const User = mongoose.model("User", {
  email: {
    type: String,
    required: true,
    unique: true, // Empêche email en doublon
    match: [
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      "Veuillez fournir un email valide",
    ],
  },
  account: {
    username: String,
    avatar: Object,
  },
  token: String,
  hash: String,
  salt: String,
});

// Exporter le modèle User
module.exports = User;
