import { config } from "dotenv";
config();

import "@/ai/flows/suggest-recipes.ts";
import "@/ai/flows/improve-recipe-ideas.ts";
import "@/ai/flows/generate-recipe-image.ts"; // Added import for the new flow
