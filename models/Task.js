const mongoose = require('mongoose');

// 📌 Définition du schéma de la tâche (Task Schema)
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  priority: {
    type: String,
    enum: ['basse', 'moyenne', 'haute'],
    required: true
  },
  status: {
    type: String,
    enum: ['à faire', 'en cours', 'terminé'],
    default: 'à faire'
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
 assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: false
    }
}, { timestamps: true });

// 📌 Exportation du modèle pour l'utiliser dans les autres fichiers
module.exports = mongoose.model('Task', taskSchema);