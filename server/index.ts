import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import { z } from 'zod';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

if (!process.env.OPENAI_API_KEY) {
  console.warn('Warning: OPENAI_API_KEY is not set in environment variables');
}

const RECIPE_SYSTEM_PROMPT =
  "You are a helpful cooking assistant. Generate a recipe for the requested dish. Return valid JSON with fields: title, description, ingredients (array of strings), steps (array of objects with 'instruction' and 'imagePrompt').";

const recipeSchema = z.object({
  topic: z.string().min(3),
});

const promptSchema = z.object({
  prompt: z.string().min(5),
});

app.post('/api/generate-recipe', async (req: Request, res: Response) => {
  try {
    const validated = recipeSchema.parse(req.body);
    
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: RECIPE_SYSTEM_PROMPT },
        { role: "user", content: `Generate a recipe for ${validated.topic}.` },
      ],
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" },
    });

    const recipe = JSON.parse(completion.choices[0]!.message.content || "{}");
    res.json(recipe);
  } catch (error) {
    console.error('Error generating recipe:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to generate recipe' 
    });
  }
});

app.post('/api/generate-image', async (req: Request, res: Response) => {
  try {
    const validated = promptSchema.parse(req.body);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: validated.prompt,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = response.data?.[0]?.url || "";
    res.json({ url: imageUrl });
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to generate image' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
