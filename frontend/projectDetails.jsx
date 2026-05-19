import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MemberManager from '../components/MemberManager';

// Page de détails d'un projet
const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProject();
  }, [id]);

  // Récupérer les détails du projet
  const fetchProject = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/projects/${id}`,
        { headers: { Authorization: `Bearer ${token} `} }
      );
      setProject(response.data);
      
      // ✅ Vérifier si l'utilisateur connecté est le créateur du projet
      const userId = JSON.parse(localStorage.getItem('user'))?._id;
      setIsOwner(response.data.owner?._id === userId);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (!project) return <div>Projet non trouvé</div>;

  return (
    <div className="project-details">
      <h1>{project.title}</h1>
      <p>{project.description}</p>
      
      {/* ✅ Intégration du composant de gestion des membres (Fonctionnalité 8) */}
      <MemberManager 
        projectId={id} 
        token={token} 
        isOwner={isOwner} 
      />
      
      {/* Le reste du contenu (tâches, etc.) */}
    </div>
  );
};

export default ProjectDetails;