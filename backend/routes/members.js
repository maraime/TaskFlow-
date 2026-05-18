const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const User = require('../models/User');
const authMiddleware = require('../middlewares/auth');
const { isProjectOwner } = require('../middlewares/roleCheck');
const { sendInvitationEmail } = require('../services/emailService');

// ============================================
// 1. GET - Récupérer tous les membres d'un projet
// ============================================
router.get('/projects/:projectId/members', authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = await Project.findById(projectId)
      .populate('owner', 'name email')
      .populate('members', 'name email');
    
    if (!project) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }
    
    const isOwner = project.owner._id.toString() === req.userId;
    const isMember = project.members.some(m => m._id.toString() === req.userId);
    
    if (!isOwner && !isMember) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    
    res.json({
      owner: project.owner,
      members: project.members,
      currentUserRole: isOwner ? 'owner' : 'member'
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ============================================
// 2. POST - Inviter un membre par email (propriétaire uniquement)
// ============================================
router.post('/projects/:projectId/invite', authMiddleware, isProjectOwner, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'L\'email est requis' });
    }
    
    // Vérifier que l'email existe
    const userToInvite = await User.findOne({ email: email.toLowerCase() });
    if (!userToInvite) {
      return res.status(404).json({ 
        message: 'Aucun utilisateur trouvé avec cet email' 
      });
    }
    
    // Vérifier que ce n'est pas le propriétaire
    if (userToInvite._id.toString() === req.project.owner.toString()) {
      return res.status(400).json({ 
        message: 'Vous ne pouvez pas inviter le propriétaire du projet' 
      });
    }
    
    // Vérifier qu'il n'est pas déjà membre
    if (req.project.members.includes(userToInvite._id)) {
      return res.status(400).json({ 
        message: 'Cet utilisateur est déjà membre du projet' 
      });
    }
    
    // Ajouter le membre
    req.project.members.push(userToInvite._id);
    await req.project.save();
    
    // Envoyer l'email d'invitation
    const owner = await User.findById(req.userId);
    await sendInvitationEmail(email, req.project.title, owner.name, projectId);
    
    res.status(200).json({
      success: true,
      message: `${userToInvite.name} a été invité avec succès`,
      member: {
        _id: userToInvite._id,
        name: userToInvite.name,
        email: userToInvite.email
      }
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ============================================
// 3. DELETE - Retirer un membre (propriétaire uniquement)
// ============================================
router.delete('/projects/:projectId/members/:memberId', authMiddleware, isProjectOwner, async (req, res) => {
  try {
    const { memberId } = req.params;
    
    // Vérifier qu'on ne retire pas le propriétaire
    if (memberId === req.project.owner.toString()) {
      return res.status(400).json({ 
        message: 'Vous ne pouvez pas retirer le propriétaire du projet' 
      });
    }
    
    // Vérifier que le membre existe
    if (!req.project.members.includes(memberId)) {
      return res.status(404).json({ 
        message: 'Ce membre n\'existe pas dans le projet' 
      });
    }
    
    // Retirer le membre
    req.project.members = req.project.members.filter(
      m => m.toString() !== memberId
    );
    await req.project.save();
    
    res.status(200).json({
      success: true,
      message: 'Membre retiré avec succès'
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;