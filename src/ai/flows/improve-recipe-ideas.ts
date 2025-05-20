"use server";

/**
 * @fileOverview Enhances recipe suggestions with creative improvement ideas.
 *
 * - improveRecipeIdeas - A function that takes initial recipe suggestions and generates ideas for improvements.
 * - ImproveRecipeIdeasInput - The input type for the improveRecipeIdeas function.
 * - ImproveRecipeIdeasOutput - The return type for the improveRecipeIdeas function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const ImproveRecipeIdeasInputSchema = z.object({
  recipeSuggestions: z
    .array(z.string())
    .describe("A list of initial recipe suggestions."),
});
export type ImproveRecipeIdeasInput = z.infer<
  typeof ImproveRecipeIdeasInputSchema
>;

const ImproveRecipeIdeasOutputSchema = z.object({
  improvedRecipeIdeas: z
    .array(z.string())
    .describe("A list of creative ideas for improvements to the recipe."),
});
export type ImproveRecipeIdeasOutput = z.infer<
  typeof ImproveRecipeIdeasOutputSchema
>;

export async function improveRecipeIdeas(
  input: ImproveRecipeIdeasInput
): Promise<ImproveRecipeIdeasOutput> {
  return improveRecipeIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: "improveRecipeIdeasPrompt",
  input: { schema: ImproveRecipeIdeasInputSchema },
  output: { schema: ImproveRecipeIdeasOutputSchema },
  prompt: `You are a creative recipe improvement assistant. Given a list of recipe suggestions, generate creative ideas for improving each recipe.

Recipe Suggestions:
{{#each recipeSuggestions}}- {{{this}}}
{{/each}}

Generate a list of ideas for improvements to the recipes.
`,
});

const improveRecipeIdeasFlow = ai.defineFlow(
  {
    name: "improveRecipeIdeasFlow",
    inputSchema: ImproveRecipeIdeasInputSchema,
    outputSchema: ImproveRecipeIdeasOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
