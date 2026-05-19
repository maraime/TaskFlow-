// API Functions
async function loadMembers(projectId) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`/api/projects/${projectId}/members`, {
      headers: { Authorization:` Bearer ${token} `}
    });
    return response.data;
  } catch (error) {
    console.error('Erreur:', error);
    return null;
  }
}

async function inviteMember(projectId, email) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
     ` /api/projects/${projectId}/invite`,
      { email },
      { headers: { Authorization: `Bearer ${token} `} }
    );
    alert(response.data.message);
    return response.data.member;
  } catch (error) {
    alert(error.response?.data?.message || 'Erreur');
    return null;
  }
}

async function removeMember(projectId, memberId) {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`/api/projects/${projectId}/members/${memberId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert('Membre retiré avec succès');
    return true;
  } catch (error) {
    alert(error.response?.data?.message || 'Erreur');
    return false;
  }
}

// UI Functions
async function displayMembers(projectId, containerId) {
  const data = await loadMembers(projectId);
  if (!data) return;
  
  const container = document.getElementById(containerId);
  const isOwner = data.currentUserRole === 'owner';
  
  let html = `
    <h3>👥 Membres du projet</h3>
    <div class="owner">
      <strong>👑 Propriétaire:</strong> ${data.owner.name} (${data.owner.email})
    </div>
    <div class="members-list">
      <strong>📋 Membres (${data.members.length}):</strong>
      <ul>
  `;
  
  data.members.forEach(member => {
    html += `
      <li>
        ${member.name} (${member.email})
        ${isOwner ? <button onclick="removeMemberHandler('${projectId}', '${member._id}')">Retirer</button> : ''}
      </li>
    `;
  });
  
  html += `</ul></div>`;
  
  if (isOwner) {
    html += `
      <div class="invite-form">
        <input type="email" id="inviteEmail" placeholder="Email à inviter" />
        <button onclick="inviteMemberHandler('${projectId}')">Inviter</button>
      </div>
    `;
  }
  
  container.innerHTML = html;
}

// Handlers
async function inviteMemberHandler(projectId) {
  const email = document.getElementById('inviteEmail').value;
  if (!email) return alert('Entrez un email');
  await inviteMember(projectId, email);
  await displayMembers(projectId, 'membersContainer');
}

async function removeMemberHandler(projectId, memberId) {
  if (!confirm('Retirer ce membre ?')) return;
  await removeMember(projectId, memberId);
  await displayMembers(projectId, 'membersContainer');
}