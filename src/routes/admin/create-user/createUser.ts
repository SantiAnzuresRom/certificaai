import { Router } from "express";
import nodemailer from "nodemailer";
import { adminAuth, adminDb } from "../../../lib/firebaseAdmin";

const router = Router();

router.post("/", async (req, res) => {
  try {

    const { email, password, full_name, role } = req.body;

    // Crear usuario Firebase Auth
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: full_name,
    });

    // Inicializar progreso
    const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];

    const initialProgress: any = {
      uid: userRecord.uid,
      fullName: full_name,
      email,
      role: role || "student",
      currentLevel: "A1",
      access_blocked: false,
      needs_password_change: true,
      created_at: new Date().toISOString(),
    };

    levels.forEach((lvl) => {
      initialProgress[`modules_${lvl}`] = {
        grammar: 0,
        reading: 0,
        writing: 0,
        listening: 0,
        speaking: 0,
      };
    });

    // Guardar en Firestore
    await adminDb
      .collection("user_progress")
      .doc(userRecord.uid)
      .set(initialProgress);

    // Configurar correo
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"CertificaAI Support" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "🚀 Tus credenciales de acceso - CertificaAI",
      html: `
        <div style="font-family: sans-serif; background-color: #020617; color: #ffffff; padding: 40px; border-radius: 20px;">
          <h2 style="color: #06b6d4;">¡Bienvenido, ${full_name}!</h2>

          <p>
            Tu cuenta para CertificaAI ha sido creada.
          </p>

          <div style="background-color: #0f172a; padding: 20px; border-radius: 15px; margin-top: 20px;">
            <p><strong>Usuario:</strong> ${email}</p>
            <p><strong>Contraseña:</strong> ${password}</p>
          </div>
        </div>
      `,
    };

    // Enviar correo
    await transporter.sendMail(mailOptions);

    return res.json({
      success: true,
      uid: userRecord.uid,
      message: "Usuario creado y correo enviado",
    });

  } catch (error: any) {

    console.error("Error create-user:", error);

    return res.status(500).json({
      error: error.message || "Error interno del servidor",
    });
  }
});

export default router;