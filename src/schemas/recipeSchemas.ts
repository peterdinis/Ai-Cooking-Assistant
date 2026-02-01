import { z } from "zod";

export const recipeSchema = z.object({
	topic: z.string().min(3),
});

export const promptSchema = z.object({
	prompt: z.string().min(5),
});
