import { z } from "zod";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const recipeSchema = z.object({
	topic: z.string().min(3),
});

const promptSchema = z.object({
	prompt: z.string().min(5),
});

export const generateRecipe = async (input: { data: { topic: string } }) => {
	// Validate input
	const validated = recipeSchema.parse(input.data);
	
	const response = await fetch(`${API_BASE_URL}/api/generate-recipe`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(validated),
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({ error: "Failed to generate recipe" }));
		throw new Error(error.error || "Failed to generate recipe");
	}

	return response.json();
};

export const generateImage = async (input: { data: { prompt: string } }) => {
	// Validate input
	const validated = promptSchema.parse(input.data);
	
	const response = await fetch(`${API_BASE_URL}/api/generate-image`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(validated),
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({ error: "Failed to generate image" }));
		throw new Error(error.error || "Failed to generate image");
	}

	const data = await response.json();
	return data.url || "";
};
