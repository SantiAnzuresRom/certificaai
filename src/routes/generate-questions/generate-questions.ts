import { Router } from "express";
import OpenAI from "openai";

const router = Router();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/", async (req, res) => {
  try {

    const { type, level } = req.body;

    // Prompts
    const prompts: Record<string, string> = {

      grammar: `
Act as a senior IELTS Examiner.

Generate 5 grammar MCQs for level ${level}.

Each question MUST include a '___' where the answer goes.

IMPORTANT:
- In 'options', provide ONLY the words
- NO letters like 'A)'
- 'correctAnswer' MUST match one option exactly

JSON Structure:
{
  "questions": [
    {
      "question": "...",
      "options": ["word1", "word2", "word3", "word4"],
      "correctAnswer": "word1"
    }
  ]
}
`,

      reading: `
Act as an IELTS Examiner.

Generate an IELTS academic reading passage
and 5 questions for level ${level}.

JSON Structure:
{
  "title": "...",
  "passage": "...",
  "questions": [
    {
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "exact text"
    }
  ]
}
`,

      listening: `
Act as an IELTS Examiner.

Generate a transcript of an IELTS listening section
and 5 questions for level ${level}.

JSON Structure:
{
  "passage": "...",
  "questions": [
    {
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "exact text"
    }
  ]
}
`,

      writing: `
Act as an IELTS Examiner.

Generate an IELTS Writing Task 2 for level ${level}.

JSON Structure:
{
  "title": "write a mini academic text of at least 250 words explaining your point in your daily routine..",
  "prompt": "[Theme or controversial statement for level ${level}]",
  "instructions": "You have 40 minutes. Focus on: Task Response, Coherence, Lexical Resource, and Grammatical Accuracy."
}
`,

      speaking: `
Act as an IELTS Examiner.

Generate 5 short pronunciation sentences
for level ${level}.

JSON Structure:
{
  "prompts": [
    "sentence 1",
    "sentence 2",
    "sentence 3",
    "sentence 4",
    "sentence 5"
  ]
}
`
    };

    const selectedPrompt =
      prompts[type] ||
      "Generate 5 general English exercises in JSON format.";

    // OpenAI
    const response = await client.chat.completions.create({

      model: "gpt-4o",

      response_format: {
        type: "json_object",
      },

      messages: [
        {
          role: "system",
          content:
            "You are a senior IELTS Certified Examiner. You only output valid JSON. Ensure correctAnswer matches one option exactly.",
        },

        {
          role: "user",
          content: selectedPrompt,
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

    console.error("Error generating questions:", error);

    return res.status(500).json({
      error: error.message || "Failed to generate content",
    });
  }
});

export default router;