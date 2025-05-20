import type { RecipeSuggestion } from "@/types/recipe";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { UtensilsCrossed, ArrowRight } from "lucide-react";

interface RecipeCardProps {
  recipe: RecipeSuggestion;
  onViewDetails: (recipe: RecipeSuggestion) => void;
}

export function RecipeCard({ recipe, onViewDetails }: RecipeCardProps) {
  // Use generated image if available, otherwise fallback to placeholder
  const imageUrl =
    recipe.imageDataUri ||
    `https://picsum.photos/seed/${recipe.title.replace(/\s/g, "")}/400/250`;
  const imageAlt = `Image of ${recipe.title}`;
  // Use a generic hint since the image might be specific or a placeholder
  const aiHint = "recipe photo";

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="relative w-full h-48 mb-2">
          <Image
            // Use conditional src
            src={imageUrl}
            alt={imageAlt}
            fill // Use fill instead of layout
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Add sizes prop for responsiveness with fill
            style={{ objectFit: "cover" }} // Use style objectFit with fill
            className="rounded-t-lg"
            // Update data-ai-hint
            data-ai-hint={aiHint}
            // Add unoptimized prop if using data URIs frequently to avoid Next.js optimization overhead for them
            unoptimized={!!recipe.imageDataUri}
          />
        </div>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <UtensilsCrossed className="h-5 w-5 text-primary flex-shrink-0" />
          {recipe.title}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground line-clamp-3 min-h-[3.75rem]">
          {recipe.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {/* Content area remains */}
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => onViewDetails(recipe)}
          variant="outline"
          className="w-full border-primary text-primary hover:bg-primary/10 hover:text-primary"
        >
          View Full Recipe
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
