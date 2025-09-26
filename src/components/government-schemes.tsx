"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useLanguage } from "@/context/language-context";
import { Building, Loader, AlertCircle, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { generateSchemesAction } from "@/lib/actions";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Skeleton } from "./ui/skeleton";

interface Scheme {
  schemeName: string;
  description: string;
  eligibility: string;
  url: string;
}

export function GovernmentSchemes() {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [schemes, setSchemes] = useState<Scheme[]>([]);

  useEffect(() => {
    if (isOpen && schemes.length === 0) {
      const fetchSchemes = async () => {
        setLoading(true);
        setError(null);
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              const res = await generateSchemesAction({ latitude, longitude, language });
              if (res.success && res.data) {
                setSchemes(res.data.schemes);
              } else {
                setError(res.error || "Failed to fetch schemes.");
              }
              setLoading(false);
            },
            () => {
              setError(t("locationAccessDenied"));
              setLoading(false);
            }
          );
        } else {
          setError(t("geolocationNotSupported"));
          setLoading(false);
        }
      };
      fetchSchemes();
    }
  }, [isOpen, schemes.length, language, t]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full py-6 text-base">
          <Building className="w-6 h-6 mr-2" />
          Govt. Departments
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Government Agricultural Schemes</DialogTitle>
          <DialogDescription>
            Discover relevant government schemes for your region powered by AI.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {loading && (
            <div className="space-y-4">
              <Skeleton className="w-full h-24" />
              <Skeleton className="w-full h-24" />
              <Skeleton className="w-full h-24" />
            </div>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {!loading && !error && schemes.length > 0 && (
            <div className="space-y-4">
              {schemes.map((scheme, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-primary">
                    <Sparkles className="w-5 h-5" />
                    {scheme.schemeName}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{scheme.description}</p>
                  <div className="mt-3">
                    <p className="text-sm font-semibold">Eligibility:</p>
                    <p className="text-sm text-muted-foreground">{scheme.eligibility}</p>
                  </div>
                  <Button variant="link" asChild className="px-0 mt-2">
                    <a href={scheme.url} target="_blank" rel="noopener noreferrer">
                      Learn More
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          )}
           {!loading && !error && schemes.length === 0 && (
            <p className="text-center text-muted-foreground">No schemes found for your location.</p>
           )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
