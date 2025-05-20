"use server";
/**
 * @fileOverview Generates an image for a given recipe title.
 *
 * - generateRecipeImage - A function that handles the recipe image generation.
 * - GenerateRecipeImageInput - The input type for the generateRecipeImage function.
 * - GenerateRecipeImageOutput - The return type for the generateRecipeImage function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const GenerateRecipeImageInputSchema = z.object({
  recipeTitle: z
    .string()
    .describe("The title of the recipe to generate an image for."),
});
export type GenerateRecipeImageInput = z.infer<
  typeof GenerateRecipeImageInputSchema
>;

const GenerateRecipeImageOutputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "The generated image as a data URI. Format: 'data:image/png;base64,<encoded_data>'."
    ),
});
export type GenerateRecipeImageOutput = z.infer<
  typeof GenerateRecipeImageOutputSchema
>;

export async function generateRecipeImage(
  input: GenerateRecipeImageInput
): Promise<GenerateRecipeImageOutput> {
  return generateRecipeImageFlow(input);
}

// Note: Image generation can take several seconds.
const generateRecipeImageFlow = ai.defineFlow(
  {
    name: "generateRecipeImageFlow",
    inputSchema: GenerateRecipeImageInputSchema,
    outputSchema: GenerateRecipeImageOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      // IMPORTANT: ONLY the googleai/gemini-2.0-flash-exp model can generate images.
      model: "googleai/gemini-2.0-flash-exp",
      prompt: `Generate a visually appealing and appetizing photo of the finished dish: "${input.recipeTitle}". The image should closely represent the actual ingredients and cooking style of the recipe. Ensure the dish looks delicious, authentic, and inviting, with attention to detail in the presentation.`,
      config: {
        // IMPORTANT: MUST provide both TEXT and IMAGE modalities.
        responseModalities: ["TEXT", "IMAGE"],
        // Adjust safety settings if needed, otherwise defaults will be used
        // safetySettings: [
        //   { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        // ],
      },
      // Optional: Specify negative prompts if certain elements should be avoided
      // negativePrompt: ['no people', 'no hands', 'simple background'],
    });

    if (!media || !media.url) {
      throw new Error("Image generation failed or returned no media URL.");
    }

    // media.url should be the data URI
    return { imageDataUri: media.url };
  }
);
