import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Composant pour la gestion des membres d'un projet
// Conforme à la spécification Fonctionnalité 8
const MemberManager = ({ projectId, token, isOwner }) => {
  // États pour stocker les membres, le propriétaire, l'email d'invitation, etc.
  const [members, setMembers] = useState([]);
  const [owner, setOwner] = useState(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Chargement des membres au montage du composant
  useEffect(() => {
    fetchMembers();
  }, [projectId]);

  // ✅ Récupérer la liste des membres (GET /api/projects/:id/members)
  const fetchMembers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/projects/${projectId}/members`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMembers(response.data.members);
      setOwner(response.data.owner);
    } catch (error) {
      console.error('Erreur lors du chargement des membres', error);
      setMessage('❌ Erreur lors du chargement des membres');
    }
  };

  // ✅ Invitation par email (POST /api/projects/:id/invite)
  // Vérifie que l'email correspond à un compte existant côté serveur
  const handleInvite = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(
        `http://localhost:5000/api/projects/${projectId}/invite`,
        { email: inviteEmail },
        { headers: { Authorization: `Bearer ${token}`} }
      );
      setMembers(response.data.project.members);
      setInviteEmail('');
      setMessage('✅ Membre invité avec succès');
    } catch (error) {
      setMessage('❌ ' + (error.response?.data?.message || 'Erreur lors de l\'invitation'));
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // ✅ Retirer un membre (DELETE /api/projects/:id/members/:memberId)
  // Seul le créateur peut retirer un membre
  const handleRemove = async (memberId, memberName) => {
    if (!window.confirm(`Voulez-vous retirer ${memberName} du projet ?`)) return;

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/projects/${projectId}/members/${memberId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMembers(response.data.project.members);
      setMessage('✅ Membre retiré avec succès');
    } catch (error) {
      setMessage('❌ ' + (error.response?.data?.message || 'Erreur lors du retrait'));
    }
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="member-manager">
      <h3>👥 Gestion des membres</h3>

      {/* Affichage des messages de succès/erreur */}
      {message && (
        <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-danger'}`}>
          {message}
        </div>
      )}

      {/* ✅ Formulaire d'invitation - visible uniquement pour le créateur du projet */}
      {isOwner && (
        <form onSubmit={handleInvite} className="invite-form">
          <div className="form-group">
            <label>Inviter un membre par email</label>
            <div className="invite-input-group">
              <input
                type="email"
                className="form-control"
                placeholder="email@exemple.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Invitation...' : '+ Inviter'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ✅ Liste des membres du projet */}
      <div className="members-list">
        <h4>Membres de l'équipe ({members.length + 1})</h4>

        {/* Affichage du créateur (owner) */}
        {owner && (
          <div className="member-item owner">
            <span className="member-name">👑 <strong>{owner.name}</strong></span>
            <span className="member-email">{owner.email}</span>
            <span className="badge owner-badge">Créateur</span>
          </div>
        )}

        {/* Affichage des autres membres */}
        {members.map(member => (
          <div key={member._id} className="member-item">
            <span className="member-name">👤 <strong>{member.name}</strong></span>
            <span className="member-email">{member.email}</span>
            {/* ✅ Bouton de retrait - visible uniquement pour le créateur */}
            {isOwner && member._id !== owner?._id && (
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleRemove(member._id, member.name)}
              >
                🗑️ Retirer
              </button>
            )}
          </div>
        ))}

        {members.length === 0 && (
          <p className="text-muted">Aucun autre membre dans ce projet</p>
        )}
      </div>
    </div>
  );
};

export default MemberManager;