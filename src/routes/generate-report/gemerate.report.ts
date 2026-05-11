import { Router } from "express";
import OpenAI from "openai";

const router = Router();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/", async (req, res) => {
  try {

    const {
      reading,
      writing,
      listening,
      speaking,
      level,
    } = req.body;

    const response = await client.chat.completions.create({

      model: "gpt-4o-mini",

      response_format: {
        type: "json_object",
      },

      messages: [
        {
          role: "system",

          content: `
You are an expert English Coach.

Based on the student's scores in an English exam
(Level ${level}), generate a professional report.

Return ONLY a JSON object with this structure:

{
  "ai_advice": "A powerful 1-sentence strategic advice",
  "steps": [
    "Step 1",
    "Step 2",
    "Step 3"
  ]
}
`,
        },

        {
          role: "user",

          content: `
Scores:

Reading: ${reading}%
Writing: ${writing}%
Listening: ${listening}%
Speaking: ${speaking}%
`,
        },
      ],
    });

    const content = response.choices[0].message.content;

    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    const data = JSON.parse(content);

    return res.json(data);

  } catch (error: any) {

    console.error("Error en reporte:", error);

    return res.status(500).json({
      error: error.message || "Failed to generate report",
    });
  }
});

export default router;