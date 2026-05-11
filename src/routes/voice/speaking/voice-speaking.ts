import { Router } from "express";
import OpenAI from "openai";

const router = Router();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/", async (req, res) => {
  try {

    const { text } = req.body;

    // Validación
    if (!text) {

      return res.status(400).json({
        error: "Missing text",
      });
    }

    // Generar audio TTS
    const mp3 = await client.audio.speech.create({

      model: "tts-1-hd",

      voice: "nova",

      input: text,

      speed: 1.0,
    });

    // Convertir a buffer
    const buffer = Buffer.from(
      await mp3.arrayBuffer()
    );

    // Headers audio
    res.setHeader("Content-Type", "audio/mpeg");

    res.setHeader(
      "Content-Length",
      buffer.length.toString()
    );

    // Enviar audio
    return res.send(buffer);

  } catch (error: any) {

    console.error("Error en TTS:", error);

    return res.status(500).json({
      error: error.message || "TTS failed",
    });
  }
});

export default router;