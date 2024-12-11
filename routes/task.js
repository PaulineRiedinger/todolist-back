// Importer Express
const express = require("express");

// Importer modèle Task
const Task = require("../models/Task");

// Initialisation du routeur pour gérer les routes liées aux tâches
const router = express.Router();

// CRUD (Create, Read, Update, Delete)

// Route POST /tasks pour ajouter tâche
router.post("/tasks", async (req, res) => {
  try {
    const { task, detail, completed, category } = req.body;

    // Vérif présence de la tâche
    if (!task) {
      return res.status(400).json({ message: "La tâche est requise" });
    }

    // Créer une nouvelle tâche
    const newTask = new Task({
      task,
      detail,
      completed,
      category,
    });

    // Sauvegarder la tâche dans la base de données
    await newTask.save();

    // Répondre avec tâche créée
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Erreur lors de la création de la tâche :", error); // Afficher erreur
    res
      .status(400)
      .json({ message: "Erreur lors de la création de la tâche", error });
  }
});

// Route GET /tasks pour récupérer toutes les tâches
router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find(); // Trouver toutes les tâches
    res.status(200).json(tasks); // Répondre avec les tâches
  } catch (error) {
    res
      .status(400)
      .json({ message: "Erreur lors de la récupération des tâches", error });
  }
});

// Route PUT /tasks/:id pour modifier tâche
router.put("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params; // Récupérer l'id de la tâche à modifier
    const { task, detail, completed, category } = req.body;

    // Vérif de la présence de la tâche
    if (!task) {
      return res.status(400).json({ message: "La tâche est requise" });
    }

    // Trouver tâche par son id et la mettre à jour
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { task, detail, completed, category },
      { new: true } // Retourner tâche MàJ
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    // Répondre avec tâche MàJ
    res.status(200).json(updatedTask);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Erreur lors de la modification de la tâche", error });
  }
});

// Route DELETE /tasks/:id pour supprimer tâche
router.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params; // Récupérer l'id de la tâche à supprimer

    // Supprimer tâche par son id
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    // Répondre avec message de succès
    res.status(200).json({ message: "Tâche supprimée" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Erreur lors de la suppression de la tâche", error });
  }
});

// Exporter routeur
module.exports = router;
