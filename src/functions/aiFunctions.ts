import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const getOpenAIClient = async () => {
	const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
	if (!apiKey) throw new Error("Missing OpenAI API Key");

	const OpenAI = (await import("openai")).default;
	return new OpenAI({ apiKey });
};

const RECIPE_SYSTEM_PROMPT =
	"You are a helpful cooking assistant. Generate a recipe for the requested dish. Return valid JSON with fields: title, description, ingredients (array of strings), steps (array of objects with 'instruction' and 'imagePrompt').";

const recipeSchema = z.object({
	topic: z.string().min(3),
});

const promptSchema = z.object({
	prompt: z.string().min(5),
});

export const generateRecipe = createServerFn({ method: "POST" })
	.inputValidator(recipeSchema)
	.handler(async ({ data }) => {
		const openai = await getOpenAIClient();

		const completion = await openai.chat.completions.create({
			messages: [
				{ role: "system", content: RECIPE_SYSTEM_PROMPT },
				{ role: "user", content: `Generate a recipe for ${data.topic}.` },
			],
			model: "gpt-3.5-turbo",
			response_format: { type: "json_object" },
		});

		return JSON.parse(completion.choices[0].message.content || "{}");
	});

export const generateImage = createServerFn({ method: "POST" })
	.inputValidator(promptSchema)
	.handler(async ({ data }) => {
		const openai = await getOpenAIClient();

		const response = await openai.images.generate({
			model: "dall-e-3",
			prompt: data.prompt,
			n: 1,
			size: "1024x1024",
		});

		return response.data![0]?.url || "";
	});
