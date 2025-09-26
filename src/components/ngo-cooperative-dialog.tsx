
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
import { HeartHandshake, Loader, Send, BarChart, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { useToast } from "@/hooks/use-toast";
import { generateMarketTrendAnalysisAction } from "@/lib/actions";
import { Skeleton } from "./ui/skeleton";
import { Progress } from "./ui/progress";

const formSchema = z.object({
  cropName: z.string().min(2, "Crop name is required."),
  location: z.string().min(2, "Location is required."),
});

type FormValues = z.infer<typeof formSchema>;

interface TrendResult {
  trend: "upward" | "downward" | "stable";
  analysis: string;
  confidence: number;
}

export function NgoCooperativeDialog() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrendResult | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { cropName: "", location: "" },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    setResult(null);
    const res = await generateMarketTrendAnalysisAction({ ...values, language });
    if (res.success && res.data) {
      setResult(res.data);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: res.error || "Failed to get market trend analysis.",
      });
    }
    setLoading(false);
  }
  
  const TrendIcon = ({trend}: {trend: TrendResult['trend']}) => {
    if (trend === 'upward') return <TrendingUp className="w-6 h-6 text-green-500" />;
    if (trend === 'downward') return <TrendingDown className="w-6 h-6 text-red-500" />;
    return <Minus className="w-6 h-6 text-gray-500" />;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full h-full py-6 text-base">
          <HeartHandshake className="w-6 h-6 mr-2" />
          NGOs & Cooperatives
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <BarChart />
            Market Trend Analysis
          </DialogTitle>
          <DialogDescription>
            Empower collective decision-making with AI-powered market trend forecasts. Enter a crop and market to get a one-week price trend analysis.
          </DialogDescription>
        </DialogHeader>
        <Card>
          <CardContent className="p-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-end">
                <FormField
                  control={form.control}
                  name="cropName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Crop Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Tomato" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Market Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Pune" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={loading} className="w-full md:w-auto md:col-span-2">
                  {loading ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Analyze Trend
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        {loading && <Skeleton className="w-full h-32" />}

        {result && (
          <Card className="animate-in fade-in">
            <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Price Trend</p>
                        <p className="flex items-center gap-2 text-xl font-bold capitalize">
                            <TrendIcon trend={result.trend} />
                            {result.trend}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium text-muted-foreground">Confidence</p>
                        <p className="text-xl font-bold">{(result.confidence * 100).toFixed(0)}%</p>
                    </div>
                </div>
                <Progress value={result.confidence * 100} className="mt-2 h-2" />
                <p className="mt-4 text-sm font-medium">Analysis:</p>
                <p className="text-sm text-muted-foreground">{result.analysis}</p>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}
