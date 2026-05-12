import {
  Request,
  Response,
  Router
} from "express";

import OpenAI from "openai";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = Router();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* =========================
   CREAR CARPETA uploads
========================= */

if (!fs.existsSync("uploads")) {

  fs.mkdirSync("uploads");
}

/* =========================
   MULTER STORAGE
========================= */

const storage = multer.diskStorage({
  

  destination: (
    req,
    file,
    cb
  ) => {

    cb(null, "uploads/");
  },

  filename: (
    req,
    file,
    cb
  ) => {

    console.log("MIME:", file.mimetype);
    console.log("ORIGINAL:", file.originalname);

    let extension = ".webm";

    if (file.mimetype.includes("wav")) {
      extension = ".wav";
    }

    if (file.mimetype.includes("mp3")) {
      extension = ".mp3";
    }

    if (file.mimetype.includes("ogg")) {
      extension = ".ogg";
    }

    cb(
      null,
      `${Date.now()}${extension}`
    );
  },
});
const upload = multer({
  storage,
});

/* =========================
   ROUTE
========================= */

router.post(
  "/",
  upload.single("audio"),

  async (
    req: Request & {
      file?: Express.Multer.File;
    },
    res: Response
  ) => {

    try {

      console.log(
        "REQ FILE:",
        req.file
      );

      if (!req.file) {

        return res.status(400).json({
          error: "No audio file provided",
        });
      }

      console.log(
        "PATH:",
        req.file.path
      );

      console.log(
        "MIMETYPE:",
        req.file.mimetype
      );

      console.log(
        "SIZE:",
        req.file.size
      );

      const audioFile =
        fs.createReadStream(
          req.file.path
        );

      const transcription =
        await client.audio.transcriptions.create({

          file: audioFile as any,

          model: "whisper-1",

          language: "en",

          response_format: "json",

          temperature: 0.2,
        });

      console.log(
        "TRANSCRIPTION:",
        transcription
      );

      // borrar archivo después
      fs.unlinkSync(req.file.path);

      return res.json({
        text: transcription.text,
      });

    } catch (error: any) {

      console.error(
        "WHISPER ERROR:",
        error
      );

      return res.status(500).json({

        error:
          error?.message ||
          "Error transcribing audio",
      });
    }
  }
);

export default router;