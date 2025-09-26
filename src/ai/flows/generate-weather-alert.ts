'use server';

/**
 * @fileOverview Generates a weather alert based on weather data.
 *
 * @function generateWeatherAlert - The main function to generate a weather alert.
 * @typedef {Object} GenerateWeatherAlertInput - The input type for the generateWeatherAlert function.
 * @typedef {Object} GenerateWeatherAlertOutput - The return type for the generateWeatherAlert function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { GetWeatherDataOutput } from './get-weather-data';

const GenerateWeatherAlertInputSchema = z.object({
  weatherData: z.any().describe('The weather data object from getWeatherDataFlow.'),
  language: z.string().optional().describe('The language for the weather alert. e.g., en, hi, bn, te, pa'),
});

export type GenerateWeatherAlertInput = z.infer<typeof GenerateWeatherAlertInputSchema>;

const GenerateWeatherAlertOutputSchema = z.object({
  alert: z.string().describe('A concise and actionable weather alert, or an empty string if no alert is needed.'),
  severity: z.enum(["low", "medium", "high", "none"]).describe('The severity of the alert.'),
});

export type GenerateWeatherAlertOutput = z.infer<typeof GenerateWeatherAlertOutputSchema>;

export async function generateWeatherAlert(input: GenerateWeatherAlertInput): Promise<GenerateWeatherAlertOutput> {
  return generateWeatherAlertFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWeatherAlertPrompt',
  input: {
    schema: z.object({
        weatherData: z.any(),
        language: z.string().optional(),
    }),
  },
  output: {
    schema: GenerateWeatherAlertOutputSchema,
  },
  prompt: `You are an agricultural advisor. Based on the provided weather data, generate a short, actionable alert for a farmer if there are any conditions of concern (e.g., extreme heat > 35°C, high wind > 20 km/h, heavy rain, or other severe weather). If there are no concerns, return an empty string for the alert and 'none' for severity.
  
  {{#if language}}
  Your response must be in the following language: {{language}}.
  {{/if}}

  Current Weather:
  - Temperature: {{weatherData.current.temp}}°C
  - Feels Like: {{weatherData.current.feels_like}}°C
  - Weather: {{weatherData.current.weather.description}}
  - Wind Speed: {{weatherData.current.wind_speed}} m/s

  Forecast:
  {{#each weatherData.forecast}}
  - {{this.day}}: {{this.temp}}°C, {{this.weather.main}}
  {{/each}}
  `,
});

const generateWeatherAlertFlow = ai.defineFlow(
  {
    name: 'generateWeatherAlertFlow',
    inputSchema: GenerateWeatherAlertInputSchema,
    outputSchema: GenerateWeatherAlertOutputSchema,
  },
  async ({ weatherData, language }) => {
    if (!weatherData) {
        return { alert: '', severity: 'none' };
    }
    const { output } = await prompt({ weatherData, language });
    return output || { alert: '', severity: 'none' };
  }
);
