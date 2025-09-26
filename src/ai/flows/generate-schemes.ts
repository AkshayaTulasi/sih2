'use server';

/**
 * @fileOverview Generates a list of relevant government agricultural schemes.
 *
 * @function generateSchemes - The main function to generate schemes.
 * @typedef {Object} GenerateSchemesInput - The input type for the generateSchemes function.
 * @typedef {Object} GenerateSchemesOutput - The return type for the generateSchemes function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateSchemesInputSchema = z.object({
  latitude: z.number().describe('The latitude of the user.'),
  longitude: z.number().describe('The longitude of the user.'),
  language: z.string().optional().describe('The language for the response. e.g., en, hi, bn, te, pa'),
});

export type GenerateSchemesInput = z.infer<typeof GenerateSchemesInputSchema>;

const SchemeSchema = z.object({
    schemeName: z.string().describe("The official name of the agricultural scheme."),
    description: z.string().describe("A brief summary of the scheme's objectives and benefits."),
    eligibility: z.string().describe("A concise summary of the eligibility criteria for farmers."),
    url: z.string().url().describe("A (simulated but realistic) URL to the official scheme page."),
});

const GenerateSchemesOutputSchema = z.object({
  schemes: z.array(SchemeSchema).describe('A list of 3 relevant agricultural schemes.'),
});

export type GenerateSchemesOutput = z.infer<typeof GenerateSchemesOutputSchema>;

export async function generateSchemes(input: GenerateSchemesInput): Promise<GenerateSchemesOutput> {
  return generateSchemesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSchemesPrompt',
  input: {
    schema: GenerateSchemesInputSchema,
  },
  output: {
    schema: GenerateSchemesOutputSchema,
  },
  prompt: `You are an expert on government agricultural policies. Your task is to identify 3 relevant and realistic agricultural schemes for a farmer based on their location.

  The user is at latitude: {{{latitude}}} and longitude: {{{longitude}}}.
  
  {{#if language}}
  The response should be in the following language: {{language}}
  {{else}}
  The response should be in English.
  {{/if}}

  Based on the location, determine the country and state/province. Then, generate a list of 3 real or realistic-sounding agricultural schemes from national or state-level government bodies. For each scheme, provide a name, a brief description, the eligibility criteria, and a simulated but valid-looking URL.
  `, 
});

const generateSchemesFlow = ai.defineFlow(
  {
    name: 'generateSchemesFlow',
    inputSchema: GenerateSchemesInputSchema,
    outputSchema: GenerateSchemesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
