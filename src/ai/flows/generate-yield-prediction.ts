'use server';

/**
 * @fileOverview Generates a yield prediction for a specific crop.
 *
 * @function generateYieldPrediction - The main function to generate the prediction.
 * @typedef {Object} GenerateYieldPredictionInput - The input type for the function.
 * @typedef {Object} GenerateYieldPredictionOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateYieldPredictionInputSchema = z.object({
  cropName: z.string().describe('The name of the crop.'),
  soilType: z.string().describe('The type of soil (e.g., Loam, Clay, Sandy).'),
  nitrogen: z.number().describe('Nitrogen level in the soil (ppm).'),
  phosphorus: z.number().describe('Phosphorus level in the soil (ppm).'),
  potassium: z.number().describe('Potassium level in the soil (ppm).'),
  language: z.string().optional().describe('The language for the response. e.g., en, hi, bn, te, pa'),
});

export type GenerateYieldPredictionInput = z.infer<typeof GenerateYieldPredictionInputSchema>;

const GenerateYieldPredictionOutputSchema = z.object({
  predictedYield: z.string().describe("A simulated but realistic predicted yield for the crop, in tons per hectare or a similar appropriate unit."),
  analysis: z.string().describe("A brief analysis explaining the prediction, referencing the provided soil data."),
  suggestions: z.string().describe("One or two actionable suggestions to potentially improve the yield based on the inputs."),
});

export type GenerateYieldPredictionOutput = z.infer<typeof GenerateYieldPredictionOutputSchema>;

export async function generateYieldPrediction(input: GenerateYieldPredictionInput): Promise<GenerateYieldPredictionOutput> {
  return generateYieldPredictionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateYieldPredictionPrompt',
  input: {
    schema: GenerateYieldPredictionInputSchema,
  },
  output: {
    schema: GenerateYieldPredictionOutputSchema,
  },
  prompt: `You are an agricultural scientist specializing in crop yield prediction. Your task is to provide a simulated but realistic yield forecast based on soil data.

  Crop: {{{cropName}}}
  Soil Type: {{{soilType}}}
  Nitrogen (N): {{{nitrogen}}} ppm
  Phosphorus (P): {{{phosphorus}}} ppm
  Potassium (K): {{{potassium}}} ppm

  {{#if language}}
  The response should be in the following language: {{language}}
  {{else}}
  The response should be in English.
  {{/if}}

  Based on these inputs, provide a predicted yield. Also, give a brief analysis and one or two actionable suggestions to improve the potential yield.
  `, 
});

const generateYieldPredictionFlow = ai.defineFlow(
  {
    name: 'generateYieldPredictionFlow',
    inputSchema: GenerateYieldPredictionInputSchema,
    outputSchema: GenerateYieldPredictionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
