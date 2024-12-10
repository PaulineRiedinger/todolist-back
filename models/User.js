// Importer mongoose
const mongoose = require("mongoose");

// Déclarer modèle mongoose User pour créer une collection User dans BDD
const User = mongoose.model("User", {
  email: String,
  account: {
    username: String,
    avatar: Object,
  },
  newsletter: Boolean,
  token: String,
  hash: String,
  salt: String,
});

// Exporter le modèle User
module.exports = User;
