const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true,
    maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères']
  },
  description: {
    type: String,
    default: '',
    maxlength: [500, 'La description ne peut pas dépasser 500 caractères']
  },
  dueDate: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['actif', 'en pause', 'archivé'],
    default: 'actif'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // ⭐ Membres du projet (Fonctionnalité 8)
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

// Middleware: Empêcher que le propriétaire soit dans members
projectSchema.pre('save', function(next) {
  if (this.owner && this.members.includes(this.owner)) {
    this.members = this.members.filter(
      m => m.toString() !== this.owner.toString()
    );
  }
  next();
});

module.exports = mongoose.model('Project', projectSchema);