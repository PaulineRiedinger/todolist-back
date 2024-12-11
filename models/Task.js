const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    task: {
      type: String,
      required: true, // Tâche obligatoire
    },
    detail: {
      type: String,
      required: false, // Détail optionnel
    },
    completed: {
      type: Boolean,
      default: false, // Tâche non terminée par défaut
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

// Créer modèle à partir du schéma
const Task = mongoose.model("Task", taskSchema);

// Exporter modèle
module.exports = Task;
