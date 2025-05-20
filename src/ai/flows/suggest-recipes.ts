// 'use server'
"use server";
/**
 * @fileOverview Suggests recipes based on a photo of ingredients.
 *
 * - suggestRecipes - A function that handles the recipe suggestion process.
 * - SuggestRecipesInput - The input type for the suggestRecipes function.
 * - SuggestRecipesOutput - The return type for the suggestRecipes function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";
import { generateRecipeImage } from "./generate-recipe-image"; // Import the new flow

const SuggestRecipesInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of ingredients, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SuggestRecipesInput = z.infer<typeof SuggestRecipesInputSchema>;

// Add imageDataUri to the schema
const RecipeSuggestionSchema = z.object({
  title: z.string().describe("The title of the recipe."),
  description: z.string().describe("A brief description of the recipe."),
  ingredients: z
    .array(z.string())
    .describe("A list of ingredients for the recipe."),
  instructions: z
    .string()
    .describe(
      "Detailed, step-by-step preparation instructions for the recipe."
    ),
  imageDataUri: z
    .string()
    .optional()
    .describe(
      "A data URI of an image generated for the recipe. Format: 'data:image/png;base64,<encoded_data>'."
    ),
});

const SuggestRecipesOutputSchema = z.object({
  recipes: z
    .array(RecipeSuggestionSchema)
    .describe("A list of suggested recipes."),
});
export type SuggestRecipesOutput = z.infer<typeof SuggestRecipesOutputSchema>;

export async function suggestRecipes(
  input: SuggestRecipesInput
): Promise<SuggestRecipesOutput> {
  return suggestRecipesFlow(input);
}

const prompt = ai.definePrompt({
  name: "suggestRecipesPrompt",
  input: { schema: SuggestRecipesInputSchema },
  output: { schema: SuggestRecipesOutputSchema },
  prompt: `You are a recipe suggestion AI. A user will upload a photo of ingredients, and you will suggest recipes that can be made with those ingredients.

  Suggest at least 6 recipes.

  For each recipe, provide:
  1.  A clear, concise, and creative title that reflects the dish's unique qualities.
  2.  A detailed description that highlights the flavors, textures, and origins of the dish, enticing the user to try it.
  3.  A comprehensive list of ingredients with precise quantities and specific preparation instructions (e.g., "1 cup diced Roma tomatoes", "2 tbsp finely chopped fresh basil"). Be very specific about the ingredients based ONLY on the image, assume user has pantry staples like oil, salt, pepper.
  4.  Detailed, step-by-step instructions. Make the instructions very clear and easy to follow, breaking down complex steps into smaller, manageable actions. Include cooking times, temperatures, and visual cues to ensure accuracy.

  Respond ONLY in the requested JSON format.

  Ingredients Photo: {{media url=photoDataUri}}`,
});

const suggestRecipesFlow = ai.defineFlow(
  {
    name: "suggestRecipesFlow",
    inputSchema: SuggestRecipesInputSchema,
    outputSchema: SuggestRecipesOutputSchema,
  },
  async (input) => {
    // 1. Get recipe text suggestions
    const { output: textOutput } = await prompt(input);

    if (!textOutput?.recipes) {
      return { recipes: [] };
    }

    // 2. Generate images for each recipe in parallel
    const imageGenerationPromises = textOutput.recipes.map(async (recipe) => {
      try {
        const imageResult = await generateRecipeImage({
          recipeTitle: recipe.title,
        });
        return {
          ...recipe,
          imageDataUri: imageResult.imageDataUri,
        };
      } catch (error) {
        console.error(
          `Failed to generate image for recipe "${recipe.title}":`,
          error
        );
        // Return the recipe without the image if generation fails
        return recipe;
      }
    });

    // 3. Wait for all image generations to complete
    const recipesWithImages = await Promise.all(imageGenerationPromises);

    return { recipes: recipesWithImages };
  }
);
