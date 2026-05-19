const Project = require('../models/Project');

// Vérifier que l'utilisateur est le propriétaire du projet
const isProjectOwner = async (req, res, next) => {
  try {
    const projectId = req.params.projectId || req.params.id;
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }
    
    if (project.owner.toString() !== req.userId) {
      return res.status(403).json({ 
        message: 'Accès refusé. Seul le créateur du projet peut effectuer cette action.' 
      });
    }
    
    req.project = project;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Vérifier que l'utilisateur peut lire le projet (propriétaire ou membre)
const canReadProject = async (req, res, next) => {
  try {
    const projectId = req.params.projectId || req.params.id;
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }
    
    const isOwner = project.owner.toString() === req.userId;
    const isMember = project.members.some(m => m.toString() === req.userId);
    
    if (!isOwner && !isMember) {
      return res.status(403).json({ 
        message: 'Accès non autorisé à ce projet' 
      });
    }
    
    req.project = project;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { isProjectOwner, canReadProject };