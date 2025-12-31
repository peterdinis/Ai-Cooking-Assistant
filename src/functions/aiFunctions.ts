import { RECIPE_SYSTEM_PROMPT } from "@/constants/applicationConstants";
import { recipeSchema, promptSchema } from "@/schemas/recipeSchemas";
import { createServerFn } from "@tanstack/react-start";

const getOpenAIClient = async () => {
	const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
	if (!apiKey) throw new Error("Missing OpenAI API Key");

	const OpenAI = (await import("openai")).default;
	return new OpenAI({ apiKey });
};

export const generateRecipe = createServerFn({ method: "POST" })
	.validator(recipeSchema)
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
	.validator(promptSchema)
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
