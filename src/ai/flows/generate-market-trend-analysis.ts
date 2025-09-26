'use server';

/**
 * @fileOverview Generates a market trend analysis for a specific crop.
 *
 * @function generateMarketTrendAnalysis - The main function to generate the analysis.
 * @typedef {Object} GenerateMarketTrendAnalysisInput - The input type for the function.
 * @typedef {Object} GenerateMarketTrendAnalysisOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateMarketTrendAnalysisInputSchema = z.object({
  cropName: z.string().describe('The name of the crop to analyze.'),
  location: z.string().describe('The market location (e.g., city, state).'),
  language: z.string().optional().describe('The language for the response. e.g., en, hi, bn, te, pa'),
});

export type GenerateMarketTrendAnalysisInput = z.infer<typeof GenerateMarketTrendAnalysisInputSchema>;

const GenerateMarketTrendAnalysisOutputSchema = z.object({
  trend: z.enum(["upward", "downward", "stable"]).describe('The overall price trend for the next week.'),
  analysis: z.string().describe("A brief analysis explaining the trend prediction, considering factors like supply, demand, and seasonality."),
  confidence: z.number().min(0).max(1).describe('The confidence level of the prediction (0 to 1).'),
});

export type GenerateMarketTrendAnalysisOutput = z.infer<typeof GenerateMarketTrendAnalysisOutputSchema>;

export async function generateMarketTrendAnalysis(input: GenerateMarketTrendAnalysisInput): Promise<GenerateMarketTrendAnalysisOutput> {
  return generateMarketTrendAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMarketTrendAnalysisPrompt',
  input: {
    schema: GenerateMarketTrendAnalysisInputSchema,
  },
  output: {
    schema: GenerateMarketTrendAnalysisOutputSchema,
  },
  prompt: `You are an agricultural market analyst. Your task is to provide a simulated but realistic one-week market trend forecast for a crop in a specific location.

  Crop: {{{cropName}}}
  Location: {{{location}}}
  
  {{#if language}}
  The response should be in the following language: {{language}}
  {{else}}
  The response should be in English.
  {{/if}}

  Based on typical factors like seasonality, weather impact, and regional demand for this crop, predict whether the price trend will be "upward," "downward," or "stable" over the next 7 days. Provide a brief analysis explaining your reasoning and a confidence score for your prediction.
  `, 
});

const generateMarketTrendAnalysisFlow = ai.defineFlow(
  {
    name: 'generateMarketTrendAnalysisFlow',
    inputSchema: GenerateMarketTrendAnalysisInputSchema,
    outputSchema: GenerateMarketTrendAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
