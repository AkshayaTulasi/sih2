"use server";

import {
  detectPestAndGiveAdvice,
  type DetectPestAndGiveAdviceInput,
  type DetectPestAndGiveAdviceOutput,
} from "@/ai/flows/detect-pest-and-give-advice";
import {
  generateCropRecommendation,
  type GenerateCropRecommendationInput,
  type GenerateCropRecommendationOutput,
} from "@/ai/flows/generate-crop-recommendation";
import { getFertilizerRecommendation as getFertilizerRecommendationFlow, type GetFertilizerRecommendationInput, type GetFertilizerRecommendationOutput } from "@/ai/flows/get-fertilizer-recommendation";
import { answerQuestion as answerQuestionFlow, type AnswerQuestionInput, type AnswerQuestionOutput } from "@/ai/flows/answer-question";
import { convertTextToSpeech as convertTextToSpeechFlow, type ConvertTextToSpeechInput, type ConvertTextToSpeechOutput } from "@/ai/flows/convert-text-to-speech";
import { getWeatherData, type GetWeatherDataInput, type GetWeatherDataOutput } from "@/ai/flows/get-weather-data";
import { getMarketPrices as getMarketPricesFlow, type GetMarketPricesInput, type GetMarketPricesOutput } from "@/ai/flows/get-market-prices";
import { generateWeatherAlert, type GenerateWeatherAlertInput, type GenerateWeatherAlertOutput } from "@/ai/flows/generate-weather-alert";
import { z } from "zod";

const cropRecommendationActionSchema = z.object({
  location: z.string(),
  soilType: z.string(),
  weatherConditions: z.string(),
  growingExperience: z.string(),
  preferences: z.string().optional(),
  language: z.string().optional(),
});

export async function getCropRecommendation(
  input: GenerateCropRecommendationInput
): Promise<{
  success: boolean;
  data?: GenerateCropRecommendationOutput;
  error?: string;
}> {
  const parsed = cropRecommendationActionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid input." };
  }
  try {
    const result = await generateCropRecommendation(parsed.data);
    return { success: true, data: result };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Failed to get recommendation from AI." };
  }
}

const pestAnalysisActionSchema = z.object({
  photoDataUri: z.string(),
  language: z.string().optional(),
});

export async function getPestAnalysis(
  input: DetectPestAndGiveAdviceInput
): Promise<{
  success: boolean;
  data?: DetectPestAndGiveAdviceOutput;
  error?: string;
}> {
  const parsed = pestAnalysisActionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid input." };
  }
  try {
    const result = await detectPestAndGiveAdvice(parsed.data);
    return { success: true, data: result };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Failed to analyze image with AI." };
  }
}

const fertilizerRecommendationActionSchema = z.object({
    nitrogen: z.number(),
    phosphorus: z.number(),
    potassium: z.number(),
    ph: z.number(),
    targetCrop: z.string(),
    language: z.string().optional(),
});

export async function getFertilizerRecommendation(input: GetFertilizerRecommendationInput): Promise<{
    success: boolean;
    data?: GetFertilizerRecommendationOutput;
    error?: string;
}> {
    const parsed = fertilizerRecommendationActionSchema.safeParse(input);
    if (!parsed.success) {
        return { success: false, error: "Invalid input." };
    }
    try {
        const result = await getFertilizerRecommendationFlow(parsed.data);
        return { success: true, data: result };
    } catch (e) {
        console.error(e);
        return { success: false, error: "Failed to get recommendation from AI." };
    }
}

const answerQuestionActionSchema = z.object({
  question: z.string(),
  context: z.string().optional(),
  language: z.string().optional(),
});

export async function answerQuestion(input: AnswerQuestionInput): Promise<{
  success: boolean;
  data?: AnswerQuestionOutput;
  error?: string;
}> {
    const parsed = answerQuestionActionSchema.safeParse(input);
    if (!parsed.success) {
        return { success: false, error: "Invalid input." };
    }
    try {
        const result = await answerQuestionFlow(parsed.data);
        return { success: true, data: result };
    } catch (e) {
        console.error(e);
        return { success: false, error: "Failed to get answer from AI." };
    }
}

const convertTextToSpeechActionSchema = z.object({
  text: z.string(),
});

export async function convertTextToSpeech(input: ConvertTextToSpeechInput): Promise<{
  success: boolean;
  data?: ConvertTextToSpeechOutput;
  error?: string;
}> {
    const parsed = convertTextToSpeechActionSchema.safeParse(input);
    if (!parsed.success) {
        return { success: false, error: "Invalid input." };
    }
    try {
        const result = await convertTextToSpeechFlow(parsed.data);
        return { success: true, data: result };
    } catch (e) {
        console.error(e);
        return { success: false, error: "Failed to convert text to speech." };
    }
}

const getWeatherDataActionSchema = z.object({
    latitude: z.number(),
    longitude: z.number(),
    language: z.string().optional(),
});

export async function fetchWeatherData(input: GetWeatherDataInput): Promise<{
    success: boolean;
    data?: GetWeatherDataOutput;
    error?: string;
}> {
    const parsed = getWeatherDataActionSchema.safeParse(input);
    if (!parsed.success) {
        return { success: false, error: "Invalid input." };
    }
    try {
        const result = await getWeatherData(parsed.data);
        return { success: true, data: result };
    } catch (e) {
        if (e instanceof Error) {
            return { success: false, error: e.message };
        }
        return { success: false, error: "Failed to fetch weather data." };
    }
}

const getMarketPricesActionSchema = z.object({
    latitude: z.number(),
    longitude: z.number(),
    language: z.string().optional(),
});

export async function getMarketPrices(input: GetMarketPricesInput): Promise<{
    success: boolean;
    data?: GetMarketPricesOutput;
    error?: string;
}> {
    const parsed = getMarketPricesActionSchema.safeParse(input);
    if (!parsed.success) {
        return { success: false, error: "Invalid input." };
    }
    try {
        const result = await getMarketPricesFlow(parsed.data);
        return { success: true, data: result };
    } catch (e) {
        if (e instanceof Error) {
            return { success: false, error: e.message };
        }
        return { success: false, error: "Failed to fetch market prices." };
    }
}

const generateWeatherAlertActionSchema = z.object({
    weatherData: z.any(),
    language: z.string().optional(),
});

export async function generateWeatherAlertAction(input: GenerateWeatherAlertInput): Promise<{
    success: boolean;
    data?: GenerateWeatherAlertOutput;
    error?: string;
}> {
    const parsed = generateWeatherAlertActionSchema.safeParse(input);
    if (!parsed.success) {
        return { success: false, error: "Invalid input." };
    }
    try {
        const result = await generateWeatherAlert(parsed.data);
        return { success: true, data: result };
    } catch (e) {
        if (e instanceof Error) {
            return { success: false, error: e.message };
        }
        return { success: false, error: "Failed to generate weather alert." };
    }
}
