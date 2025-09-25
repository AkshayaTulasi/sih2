"use client";

import { Camera, Loader, Sprout } from "lucide-react";
import { useState } from "react";

import type { DetectPestAndGiveAdviceOutput } from "@/ai/flows/detect-pest-and-give-advice";
import { getPestAnalysis } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "./ui/skeleton";
import { useLanguage } from "@/context/language-context";

export function PestDetection() {
  const [loading, setLoading] =useState(false);
  const [result, setResult] = useState<DetectPestAndGiveAdviceOutput | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  const { t, language } = useLanguage();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file || !imagePreview) {
      toast({
        variant: "destructive",
        title: t('noImageSelected'),
        description: t('noImageSelectedDescription'),
      });
      return;
    }

    setLoading(true);
    setResult(null);

    const res = await getPestAnalysis({ photoDataUri: imagePreview, language });

    if (res.success && res.data) {
      setResult(res.data);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: res.error || "Failed to analyze the image.",
      });
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl font-headline">
          {t('pestAndDiseaseDetection')}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t('pestAndDiseaseDetectionDescription')}
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="plant-image">{t('uploadPlantImage')}</Label>
              <Input
                id="plant-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file:text-primary file:font-bold"
              />
              <CardDescription>
                {t('uploadPlantImageDescription')}
              </CardDescription>
            </div>

            {imagePreview && (
              <div className="relative w-full overflow-hidden border-2 rounded-lg aspect-video border-dashed flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                <img
                  src={imagePreview}
                  alt="Plant preview"
                  className="object-contain h-full w-full"
                  data-ai-hint="plant disease"
                />
              </div>
            )}

            <Button type="submit" disabled={loading || !file} className="w-full md:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
              {loading ? (
                <Loader className="animate-spin" />
              ) : (
                <Camera />
              )}
              {t('analyzeImage')}
            </Button>
          </form>
        </CardContent>
      </Card>

      {loading && (
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="w-1/3 h-8" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="w-full h-6" />
            <Skeleton className="w-full h-6" />
            <Skeleton className="w-2/3 h-6" />
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className="animate-in fade-in">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <Sprout />
              {t('diagnosis')}: {result.pestOrDisease}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="mb-2 font-semibold">{t('treatmentAdvice')}:</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {result.advice}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
