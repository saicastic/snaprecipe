"use client";

import type { RecipeSuggestion } from "@/types/recipe";
import { suggestRecipes } from "@/ai/flows/suggest-recipes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Camera, AlertTriangle, UploadCloud, Loader2 } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "./LoadingSpinner";

interface ImageUploadFormProps {
  onSuggestionUpdate: (
    recipes: RecipeSuggestion[] | null,
    isLoading: boolean,
    error: string | null
  ) => void;
}

export function ImageUploadForm({ onSuggestionUpdate }: ImageUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    onSuggestionUpdate(null, false, null); // Clear previous results
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        // 5MB limit
        setError("File is too large. Please select an image under 5MB.");
        setFile(null);
        setPreview(null);
        toast({
          title: "Upload Error",
          description: "File is too large (max 5MB).",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFile(null);
      setPreview(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setError("Please select an image of your ingredients.");
      onSuggestionUpdate(null, false, "Please select an image.");
      toast({
        title: "No Image Selected",
        description: "Please upload an image of your ingredients.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    onSuggestionUpdate(null, true, null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64data = reader.result as string;
      try {
        const result = await suggestRecipes({ photoDataUri: base64data });
        if (result.recipes && result.recipes.length > 0) {
          onSuggestionUpdate(result.recipes, false, null);
          toast({
            title: "Recipes Found!",
            description: `We found ${result.recipes.length} recipe suggestions for you.`,
          });
        } else {
          setError(
            "No recipes found for the ingredients in the image. Try a different photo!"
          );
          onSuggestionUpdate([], false, "No recipes found.");
          toast({
            title: "No Recipes Found",
            description:
              "We couldn't find any recipes for the ingredients shown. Please try another image.",
            variant: "default", // Changed from destructive to default for informational
          });
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "An unknown error occurred while fetching recipes.";
        setError(`Failed to get suggestions: ${errorMessage}`);
        onSuggestionUpdate(
          null,
          false,
          `Failed to get suggestions: ${errorMessage}`
        );
        toast({
          title: "AI Error",
          description:
            "Something went wrong while generating recipes. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      setError("Failed to read the image file. Please try again.");
      onSuggestionUpdate(null, false, "Failed to read file.");
      setIsLoading(false);
      toast({
        title: "File Read Error",
        description: "Could not read the selected image file.",
        variant: "destructive",
      });
    };
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <UploadCloud className="h-7 w-7 text-primary" />
          Upload Ingredient Photo
        </CardTitle>
        <CardDescription>
          Snap a photo of your ingredients, and we'll suggest some delicious
          recipes!
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="ingredient-photo" className="text-base">
              Ingredient Photo
            </Label>
            <Input
              id="ingredient-photo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file:text-primary file:font-semibold hover:file:bg-primary/10"
              disabled={isLoading}
            />
          </div>

          {preview && (
            <div className="mt-4 border rounded-md p-2 bg-muted/50">
              <p className="text-sm font-medium mb-2 text-center">
                Image Preview:
              </p>
              <Image
                src={preview}
                alt="Ingredients preview"
                width={400}
                height={300}
                className="rounded-md object-contain max-h-60 w-full"
                data-ai-hint="food ingredients"
              />
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            disabled={isLoading || !file}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Suggesting Recipes...
              </>
            ) : (
              <>
                <Camera className="mr-2 h-4 w-4" />
                Get Recipe Suggestions
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
