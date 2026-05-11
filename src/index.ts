import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// IMPORTAR RUTAS
import createUser from "./routes/admin/create-user/createUser";
import evaluateSpeaking from "./routes/evaluate-speaking/evaluate-speaking";
import generateQuestions from "./routes/generate-questions/generate-questions";
import generateReport from "./routes/generate-report/gemerate.report";
import gradeWriting from "./routes/grade-writing/grade-writing";
import speakingVoice from "./routes/voice/speaking/voice-speaking";
import voiceTranscribe from "./routes/voice/transcribe/transcribe-voice";



const app = express();

// MIDDLEWARES
app.use(cors());

app.use(express.json({
  limit: "50mb",
}));

app.use(express.urlencoded({
  extended: true,
}));

// TEST
app.get("/", (_, res) => {
  res.send("Backend funcionando 🔥");
});

// RUTAS API

// ADMIN
app.use(
  "/api/admin/create-user",
  createUser
);

// SPEAKING
app.use(
  "/api/evaluate-speaking",
  evaluateSpeaking
);

// QUESTIONS IA
app.use(
  "/api/generate-questions",
  generateQuestions
);

// REPORTES IA
app.use(
  "/api/generate-report",
  generateReport
);

// WRITING
app.use(
  "/api/grade-writing",
  gradeWriting
);

// TEXT TO SPEECH
app.use(
  "/api/voice/speaking",
  speakingVoice
);

// WHISPER
app.use(
  "/api/voice/transcribe",
  voiceTranscribe
);

// PUERTO
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {

  console.log(`
🚀 Backend iniciado
🌐 Puerto: ${PORT}
🔥 API lista
  `);

});