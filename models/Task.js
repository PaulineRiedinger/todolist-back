// Importer mongoose
const mongoose = require("mongoose");

// Déclarer modèle mongoose Task pour créer la collection dans la BDD
const Task = mongoose.model(
  "Task",
  {
    task: {
      type: String,
      required: true, // Titre obligatoire
    },
    detail: {
      type: String,
      required: false, // Détail optionnel
    },
    completed: {
      type: Boolean,
      default: false, // Tâche = par défaut non terminée
    },
    category: {
      type: String,
      required: false, // Catégorie optionnelle
    },
  },
  {
    timestamps: true, // -> permet à Mongoose d'ajouter automatiquement les champs createdAt et updatedAt pour chaque doc, pour savoir quand la tâche a été créée/MàJ
  }
);

// Exporter le modèle Task
module.exports = Task;
