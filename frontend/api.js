import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// ✅ Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ========== Fonctionnalité 8 - Gestion des membres ==========

/**
 * ✅ Récupérer la liste des membres d'un projet
 * GET /api/projects/:projectId/members
 * Accessible aux membres et au créateur
 */
export const getMembers = (projectId) => api.get(`/projects/${projectId}/members`);

/**
 * ✅ Inviter un membre par email
 * POST /api/projects/:projectId/invite
 * Réservé au créateur du projet
 * Vérifie que l'email correspond à un compte existant
 */
export const inviteMember = (projectId, email) => api.post(`/projects/${projectId}/invite, { email }`);

/**
 * ✅ Retirer un membre du projet
 * DELETE /api/projects/:projectId/members/:memberId
 * Réservé au créateur du projet
 */
export const removeMember = (projectId, memberId) => api.delete(`/projects/${projectId}/members/${memberId}`);

export default api;