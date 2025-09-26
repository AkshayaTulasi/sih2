
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
import { Rocket, Loader, Send, Activity, Telescope, Wand2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useToast } from "@/hooks/use-toast";
import { generateYieldPredictionAction } from "@/lib/actions";
import { Skeleton } from "./ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";


const formSchema = z.object({
  cropName: z.string().min(2, "Crop name is required."),
  soilType: z.string().min(1, "Soil type is required."),
  nitrogen: z.coerce.number().min(0),
  phosphorus: z.coerce.number().min(0),
  potassium: z.coerce.number().min(0),
});

type FormValues = z.infer<typeof formSchema>;

interface PredictionResult {
  predictedYield: string;
  analysis: string;
  suggestions: string;
}

export function AgritechStartupDialog() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { cropName: "", soilType: "", nitrogen: 120, phosphorus: 50, potassium: 50 },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    setResult(null);
    const res = await generateYieldPredictionAction({ ...values, language });
    if (res.success && res.data) {
      setResult(res.data);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: res.error || "Failed to get yield prediction.",
      });
    }
    setLoading(false);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full h-full py-6 text-base">
          <Rocket className="w-6 h-6 mr-2" />
          Agri-Tech Startups
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Activity />
            AI-Powered Yield Prediction
          </DialogTitle>
          <DialogDescription>
            Demonstrates how a startup could integrate a proprietary model. Fill in crop and soil data to get a simulated yield forecast.
          </DialogDescription>
        </DialogHeader>
        <Card>
          <CardContent className="p-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="cropName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Crop Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Wheat" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="soilType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Soil Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select soil type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Loam">Loam</SelectItem>
                              <SelectItem value="Clay">Clay</SelectItem>
                              <SelectItem value="Sandy">Sandy</SelectItem>
                              <SelectItem value="Silty">Silty</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <FormField control={form.control} name="nitrogen" render={({ field }) => (<FormItem><FormLabel>Nitrogen (ppm)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                    <FormField control={form.control} name="phosphorus" render={({ field }) => (<FormItem><FormLabel>Phosphorus (ppm)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                    <FormField control={form.control} name="potassium" render={({ field }) => (<FormItem><FormLabel>Potassium (ppm)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? ( <Loader className="w-4 h-4 animate-spin" /> ) : ( <Send className="w-4 h-4" /> )}
                  Predict Yield
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        {loading && <Skeleton className="w-full h-32" />}

        {result && (
          <Card className="animate-in fade-in">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Telescope className="text-primary"/>
                    Yield Forecast
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                <div className="p-4 text-center border-2 border-dashed rounded-lg bg-background">
                    <p className="text-sm font-medium text-muted-foreground">Predicted Yield</p>
                    <p className="text-3xl font-bold text-primary">{result.predictedYield}</p>
                </div>
                <div>
                    <h4 className="font-semibold">Analysis</h4>
                    <p className="text-sm text-muted-foreground">{result.analysis}</p>
                </div>
                 <div>
                    <h4 className="font-semibold flex items-center gap-2"><Wand2 className="w-4 h-4" />Suggestions for Improvement</h4>
                    <p className="text-sm text-muted-foreground">{result.suggestions}</p>
                </div>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}
