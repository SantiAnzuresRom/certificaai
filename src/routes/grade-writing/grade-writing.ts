import { Router } from "express";
import OpenAI from "openai";

const router = Router();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/", async (req, res) => {
  try {

    const {
      content,
      level,
      prompt,
    } = req.body;

    // Validación
    if (!content || !prompt) {

      return res.status(400).json({
        error: "Missing content or prompt",
      });
    }

    // OpenAI
    const response = await client.chat.completions.create({

      model: "gpt-4o",

      response_format: {
        type: "json_object",
      },

      messages: [
        {
          role: "system",

          content: `
You are a professional IELTS Writing Examiner.

Grade the student's response based on the official IELTS criteria:

1. Task Response
2. Coherence and Cohesion
3. Lexical Resource
4. Grammatical Range and Accuracy

Return ONLY a JSON object:

{
  "score": number,
  "band_score": string,
  "feedback": "Detailed professional feedback",
  "strengths": [
    "point 1",
    "point 2"
  ],
  "improvements": [
    "point 1",
    "point 2"
  ]
}
`,
        },

        {
          role: "user",

          content: `
Evaluation Level: ${level}

Task Prompt:
${prompt}

Student Essay:
${content}
`,
        },
      ],
    });

    const result = response.choices[0].message.content;

    if (!result) {
      throw new Error("No response from AI");
    }

    const data = JSON.parse(result);

    return res.json(data);

  } catch (error: any) {

    console.error("Error grading writing:", error);

    return res.status(500).json({
      error: error.message || "Failed to grade writing",
    });
  }
});

export default router;