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

// IMPORTANTE:
// guardar con extensión REAL

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

    const ext =
      path.extname(file.originalname) || ".webm";

    cb(
      null,
      `${Date.now()}${ext}`
    );
  },
});

const upload = multer({
  storage,
});

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

      if (!req.file) {

        return res.status(400).json({
          error: "No audio file provided",
        });
      }

      console.log(
        "FILE:",
        req.file
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

      fs.unlinkSync(req.file.path);

      return res.json({
        text: transcription.text,
      });

    } catch (error: any) {

      console.error(
        "Whisper Error:",
        error
      );

      return res.status(500).json({
        error:
          error.message ||
          "Error transcribing audio",
      });
    }
  }
);

export default router;