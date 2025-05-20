"use client";

import React, { useState } from "react";
import type { RecipeSuggestion } from "@/types/recipe";
import { ImageUploadForm } from "@/components/ImageUploadForm";
import { RecipeCard } from "@/components/RecipeCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Utensils, SearchX, CookingPot } from "lucide-react";
import { RecipeDetailModal } from "@/components/RecipeDetailModal";

export default function HomePage() {
  const [recipes, setRecipes] = useState<RecipeSuggestion[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeSuggestion | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSuggestionUpdate = (
    updatedRecipes: RecipeSuggestion[] | null,
    loading: boolean,
    errorMessage: string | null
  ) => {
    setRecipes(updatedRecipes);
    setIsLoading(loading);
    setError(errorMessage);
  };

  const handleViewDetails = (recipe: RecipeSuggestion) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  return (
    <div className="space-y-12">
      <ImageUploadForm onSuggestionUpdate={handleSuggestionUpdate} />

      {isLoading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner
            size={64}
            label="Finding delicious recipes for you..."
          />
        </div>
      )}

      {error && !isLoading && (
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <Utensils className="h-5 w-5" />
          <AlertTitle>Oops! Something went wrong.</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!isLoading && !error && recipes === null && (
        <div className="text-center py-12 text-muted-foreground">
          <CookingPot size={64} className="mx-auto mb-4 opacity-70" />
          <h2 className="text-2xl font-semibold mb-2">Ready to Cook?</h2>
          <p className="text-lg">
            Upload a picture of your ingredients to get started!
          </p>
        </div>
      )}

      {!isLoading && !error && recipes && recipes.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <SearchX size={64} className="mx-auto mb-4 opacity-70" />
          <h2 className="text-2xl font-semibold mb-2">No Recipes Found</h2>
          <p className="text-lg">
            We couldn't find any recipes for the ingredients shown. Please try
            another image.
          </p>
        </div>
      )}

      {!isLoading && recipes && recipes.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-center text-primary flex items-center justify-center gap-2">
            <Utensils size={32} />
            Recipe Suggestions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe, index) => (
              <RecipeCard
                key={index}
                recipe={recipe}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        </section>
      )}

      {selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
