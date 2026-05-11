import { Router } from "express";
import OpenAI from "openai";

const router = Router();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/", async (req, res) => {
  try {

    console.log("--- INICIANDO EVALUACIÓN DE SPEAKING ---");

    const { attempts } = req.body;

    if (!attempts || !Array.isArray(attempts)) {

      console.error("❌ Error: No se recibieron intentos válidos");

      return res.status(400).json({
        error: "No attempts provided",
      });
    }

    console.log(`Procesando ${attempts.length} intentos...`);

    // Formatear intentos
    const attemptsSummary = attempts
      .map(
        (a: any, i: number) => `
Attempt ${i + 1}:
Target: "${a.target}"
User Said: "${a.transcript}"
`
      )
      .join("\n\n");

    // OpenAI
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",

      response_format: {
        type: "json_object",
      },

      messages: [
        {
          role: "system",
          content: `
You are an expert IELTS Speaking Examiner.

Evaluate the student's pronunciation and fluency
based on the comparison between the target sentence
and the transcript.

Return ONLY a JSON object with this structure:

{
  "overall_score": number,
  "estimated_band": string,
  "general_feedback": string,
  "pronunciation_tips": string
}
`,
        },

        {
          role: "user",
          content: `
Please evaluate these speaking attempts:

${attemptsSummary}
`,
        },
      ],

      temperature: 0.7,
    });

    const content = response.choices[0].message.content;

    if (!content) {

      console.error("❌ OpenAI devolvió contenido vacío");

      throw new Error("OpenAI returned empty content");
    }

    console.log("✅ Evaluación completada");

    // Limpiar respuesta
    const cleanContent = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return res.json(JSON.parse(cleanContent));

  } catch (error: any) {

    console.error(
      "❌ ERROR CRÍTICO EVALUATE-SPEAKING:",
      error.message
    );

    return res.status(500).json({
      error: error.message || "Failed to evaluate speaking",
    });
  }
});

export default router;