import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configuration SMTP
const mailConfig = {
  host: process.env.MAIL_HOST || 'smtp.1and1.com',
  port: parseInt(process.env.MAIL_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USERNAME || 'maarchdgd@benit.biz',
    pass: process.env.MAIL_PASSWORD || '@m@@rchdgd!2025',
  },
  tls: {
    ciphers: 'SSLv3',
  },
};

// Create transporter
const transporter = nodemailer.createTransport(mailConfig);

/**
 * Safely format a date to French locale string
 * @param {string|Date} dateValue - The date value to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date string
 */
const formatDate = (dateValue, options = {}) => {
  if (!dateValue) {
    // Fallback to current date if no date provided
    dateValue = new Date();
  }
  
  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) {
      // Invalid date, use current date
      return new Date().toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        ...options
      });
    }
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      ...options
    });
  } catch (error) {
    // Fallback to current date on error
    return new Date().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      ...options
    });
  }
};

/**
 * Send confirmation email after candidature submission
 * @param {Object} candidature - The candidature object with structure info
 * @param {string} recipientEmail - Email address of the recipient
 */
export const sendCandidatureConfirmation = async (candidature, recipientEmail) => {
  try {
    const structure = candidature.structure;
    const adminEmail = process.env.MAIL_ADMIN_RECEIVER || 'maarchdgd@benit.biz';
    const senderEmail = process.env.MAIL_SENDER || 'maarchdgd@benit.biz';

    // Email to candidate
    const candidateEmailContent = {
      from: `"Prix de l'Innovation MEF" <${senderEmail}>`,
      to: recipientEmail,
      subject: 'Confirmation de réception de votre candidature - Prix de l\'Innovation MEF',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #009639 0%, #007a2e 100%); color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9fafb; }
            .info-box { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #009639; }
            .button { display: inline-block; padding: 12px 24px; background-color: #009639; color: white; text-decoration: none; border-radius: 4px; margin: 10px 0; }
            .button:hover { background-color: #007a2e; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Prix de l'Innovation MEF</h1>
            </div>
            <div class="content">
              <p>Bonjour,</p>
              <p>Nous avons bien reçu votre candidature pour le <strong>Prix de l'Innovation MEF</strong>.</p>
              
              <div class="info-box">
                <h3>Détails de votre candidature :</h3>
                <p><strong>Structure :</strong> ${structure?.denomination || 'N/A'}</p>
                <p><strong>Catégorie :</strong> ${candidature.categorie_prix || 'N/A'}</p>
                <p><strong>Date de soumission :</strong> ${formatDate(candidature.created_at)}</p>
                <p><strong>Numéro de candidature :</strong> #${candidature.id}</p>
              </div>

              <p>Votre candidature a été enregistrée avec succès et sera examinée par le comité d'évaluation.</p>
              <p>Vous serez informé(e) de l'avancement de votre dossier par email.</p>
              
              <div style="text-align: center; margin: 20px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/candidature/statut/${candidature.id}" class="button">Voir le statut de ma candidature</a>
              </div>
              
              <p>Cordialement,<br>
              <strong>Secrétariat Technique<br>
              Prix de l'Innovation MEF<br>
              Ministère de l'Économie et des Finances - Burkina Faso</strong></p>
            </div>
            <div class="footer">
              <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Prix de l'Innovation MEF - Confirmation de réception
        
        Bonjour,
        
        Nous avons bien reçu votre candidature pour le Prix de l'Innovation MEF.
        
        Détails de votre candidature :
        - Structure : ${structure?.denomination || 'N/A'}
        - Catégorie : ${candidature.categorie_prix || 'N/A'}
        - Date de soumission : ${formatDate(candidature.created_at, { hour: undefined, minute: undefined })}
        - Numéro de candidature : #${candidature.id}
        
        Votre candidature a été enregistrée avec succès et sera examinée par le comité d'évaluation.
        Vous serez informé(e) de l'avancement de votre dossier par email.
        
        Cordialement,
        Secrétariat Technique - Prix de l'Innovation MEF
      `,
    };

    // Email to admin
    const adminEmailContent = {
      from: `"Prix de l'Innovation MEF" <${senderEmail}>`,
      to: adminEmail,
      subject: `Nouvelle candidature reçue - #${candidature.id}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #009639 0%, #007a2e 100%); color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9fafb; }
            .info-box { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #009639; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Nouvelle Candidature Reçue</h1>
            </div>
            <div class="content">
              <p>Une nouvelle candidature a été soumise pour le Prix de l'Innovation MEF.</p>
              
              <div class="info-box">
                <h3>Détails de la candidature :</h3>
                <p><strong>Numéro :</strong> #${candidature.id}</p>
                <p><strong>Structure :</strong> ${structure?.denomination || 'N/A'}</p>
                <p><strong>Email :</strong> ${structure?.email || 'N/A'}</p>
                <p><strong>Catégorie :</strong> ${candidature.categorie_prix || 'N/A'}</p>
                <p><strong>Date de soumission :</strong> ${formatDate(candidature.created_at)}</p>
              </div>

              <p>Veuillez examiner cette candidature dans le système d'administration.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Send both emails
    const [candidateResult, adminResult] = await Promise.allSettled([
      transporter.sendMail(candidateEmailContent),
      transporter.sendMail(adminEmailContent),
    ]);

    if (candidateResult.status === 'rejected') {
      console.error('Error sending email to candidate:', candidateResult.reason);
    }
    if (adminResult.status === 'rejected') {
      console.error('Error sending email to admin:', adminResult.reason);
    }

    return {
      candidateSent: candidateResult.status === 'fulfilled',
      adminSent: adminResult.status === 'fulfilled',
    };
  } catch (error) {
    console.error('Error sending candidature confirmation email:', error);
    throw error;
  }
};

/**
 * Verify email configuration
 */
export const verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email server is ready to send messages');
    return true;
  } catch (error) {
    console.error('❌ Email server configuration error:', error);
    return false;
  }
};

