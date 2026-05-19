const nodemailer = require('nodemailer');

// Configuration de travail
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

// verification de la connexion
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Erreur email:', error.message);
  } else {
    console.log('✅ Serveur email prêt (Ethereal)');
    console.log(`📧 Compte: ${process.env.EMAIL_USER}`);
  }
});

// envoyer Email
async function sendInvitationEmail(toEmail, projectName, invitedByName, projectId) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: `✨ Invitation au projet "${projectName}" - TaskFlow`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2 style="color: #4CAF50;">✨ Invitation à rejoindre un projet !</h2>
        <p><strong>${invitedByName}</strong> vous a invité à rejoindre :</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
          <h3>📁 ${projectName}</h3>
        </div>
        <a href="http://localhost:3000/project.html?id=${projectId}" 
           style="background: #4CAF50; color: white; padding: 10px 20px; 
                  text-decoration: none; border-radius: 5px;">
          Voir le projet
        </a>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email envoyé à ${toEmail}`);
    console.log(`📬 Voir l'email: ${nodemailer.getTestMessageUrl(info)}`);
    return { success: true, previewUrl: nodemailer.getTestMessageUrl(info) };
  } catch (error) {
    console.error('❌ Erreur envoi:', error.message);
    return { success: false, error: error.message };
  }
}

module.exports = { sendInvitationEmail };