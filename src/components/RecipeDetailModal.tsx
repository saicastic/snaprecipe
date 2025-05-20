"use client";

import type { RecipeSuggestion } from "@/types/recipe";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { ListChecks, NotebookText, X } from "lucide-react";

interface RecipeDetailModalProps {
  recipe: RecipeSuggestion | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RecipeDetailModal({
  recipe,
  isOpen,
  onClose,
}: RecipeDetailModalProps) {
  if (!recipe) {
    return null;
  }

  // Split instructions by newline characters for better readability
  const instructionSteps = recipe.instructions
    .split(/\n+/)
    .filter((step) => step.trim() !== "");

  // Use generated image if available, otherwise fallback to placeholder
  const imageUrl =
    recipe.imageDataUri ||
    `https://picsum.photos/seed/${recipe.title.replace(
      /\s/g,
      ""
    )}Detail/600/400`;
  const imageAlt = `Detailed image of ${recipe.title}`;
  // Use a generic hint
  const aiHint = "recipe detail photo";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-3xl font-bold text-primary">
            {recipe.title}
          </DialogTitle>
          <DialogDescription className="text-md text-muted-foreground">
            {recipe.description}
          </DialogDescription>
        </DialogHeader>

        <div className="relative w-full h-64 sm:h-80 mt-2">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill // Use fill instead of layout
            sizes="(max-width: 640px) 90vw, 600px" // Add sizes prop
            style={{ objectFit: "cover" }} // Use style objectFit with fill
            data-ai-hint={aiHint}
            // Add unoptimized prop if using data URIs frequently
            unoptimized={!!recipe.imageDataUri}
          />
        </div>

        <ScrollArea className="flex-grow overflow-y-auto px-6 py-4">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2 text-primary">
                <ListChecks className="h-6 w-6" />
                Ingredients
              </h3>
              <ul className="list-disc list-inside space-y-1 text-foreground/90 bg-secondary/50 p-4 rounded-md shadow-inner">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2 text-primary">
                <NotebookText className="h-6 w-6" />
                Instructions
              </h3>
              {instructionSteps.length > 1 ? (
                <ol className="list-decimal list-inside space-y-3 text-foreground/90">
                  {instructionSteps.map((step, index) => (
                    <li key={index} className="leading-relaxed">
                      {step}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="whitespace-pre-wrap leading-relaxed text-foreground/90">
                  {recipe.instructions}
                </p>
              )}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 pt-2 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-accent text-accent hover:bg-accent/10"
          >
            <X className="mr-2 h-4 w-4" /> Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
