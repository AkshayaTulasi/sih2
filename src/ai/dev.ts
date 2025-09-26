import { config } from 'dotenv';
config();

import '@/ai/flows/detect-pest-and-give-advice.ts';
import '@/ai/flows/generate-crop-recommendation.ts';
import '@/ai/flows/get-fertilizer-recommendation.ts';
import '@/ai/flows/answer-question.ts';
import '@/ai/flows/convert-text-to-speech.ts';
import '@/ai/flows/get-weather-data.ts';
import '@/ai/flows/get-market-prices.ts';
import '@/ai/flows/generate-weather-alert.ts';
