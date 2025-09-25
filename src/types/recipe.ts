export interface RecipeSuggestion {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string;
  imageDataUri?: string; // Added optional field for generated image
}
