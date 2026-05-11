import admin from "firebase-admin";
import path from "path";
import fs from "fs";

const serviceAccountPath = path.join(
  __dirname,
  "serviceAccountKey.json"
);

if (!fs.existsSync(serviceAccountPath)) {
  console.error(
    "❌ No se encontró el archivo en:",
    serviceAccountPath
  );
} else {
  const serviceAccount = require(serviceAccountPath);

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log("🔥 Firebase Admin conectado");
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();