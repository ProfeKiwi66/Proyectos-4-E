import * as functions from "firebase-functions";
import * as nodemailer from "nodemailer";

// Configuración de Gmail
const gmailEmail = "tomas.allendesd@gmail.com";
const gmailPassword = "tbrq fmho ynai irjk"; // ← PEGA TUS 16 DÍGITOS

const mailTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

export const sendContactEmail = functions.https.onCall(
  async (data: any, context: any) => {
    const {nombre, email, mensaje} = data;

    if (!nombre || !email || !mensaje) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Todos los campos son requeridos"
      );
    }

    const mailOptions = {
      from: `"ChronoPlan Contacto" <${gmailEmail}>`,
      to: gmailEmail,
      replyTo: email,
      subject: `Nuevo mensaje de ${nombre} - ChronoPlan`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
          <div style="background: #3b82f6; color: white; padding: 20px; text-align: center;">
            <h1>📧 Nuevo Mensaje de Contacto</h1>
            <p>ChronoPlan</p>
          </div>
          <div style="background: #f9f9f9; padding: 20px;">
            <div style="margin-bottom: 15px;">
              <strong style="color: #3b82f6;">Nombre:</strong>
              <span>${nombre}</span>
            </div>
            <div style="margin-bottom: 15px;">
              <strong style="color: #3b82f6;">Email:</strong>
              <span>${email}</span>
            </div>
            <div style="margin-bottom: 15px;">
              <strong style="color: #3b82f6;">Mensaje:</strong>
              <p>${mensaje.replace(/\n/g, '<br>')}</p>
            </div>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #666;">
            <p>Este mensaje fue enviado desde el formulario de contacto de ChronoPlan</p>
          </div>
        </div>
      `,
    };

    try {
      await mailTransport.sendMail(mailOptions);
      console.log('✅ Email enviado exitosamente a:', gmailEmail);
      return { 
        success: true, 
        message: 'Email enviado exitosamente' 
      };
    } catch (error: any) {
      console.error('❌ Error enviando email:', error);
      throw new functions.https.HttpsError(
        'internal', 
        'Error al enviar el email: ' + error.message
      );
    }
  }
);