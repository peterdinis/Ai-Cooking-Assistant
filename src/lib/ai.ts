import OpenAI from "openai";

const getOpenAIClient = () => {
	const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
	if (!apiKey) throw new Error("Missing OpenAI API Key");

	return new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
};

const RECIPE_SYSTEM_PROMPT =
	"You are a helpful cooking assistant. Generate a recipe for the requested dish. Return valid JSON with fields: title, description, ingredients (array of strings), steps (array of objects with 'instruction' and 'imagePrompt').";

export const generateRecipe = async (topic: string) => {
	const openai = getOpenAIClient();

	const completion = await openai.chat.completions.create({
		messages: [
			{ role: "system", content: RECIPE_SYSTEM_PROMPT },
			{ role: "user", content: `Generate a recipe for ${topic}.` },
		],
		model: "gpt-3.5-turbo",
		response_format: { type: "json_object" },
	});

	return JSON.parse(completion.choices[0].message.content || "{}");
};

export const generateImage = async (prompt: string) => {
	const openai = getOpenAIClient();

	const response = await openai.images.generate({
		model: "dall-e-3",
		prompt,
		n: 1,
		size: "1024x1024",
	});

	return response.data![0]?.url || "";
};
