'use server';

/**
 * @fileOverview Fetches weather data from OpenWeatherMap API.
 * 
 * @function getWeatherData - The main function to get weather data.
 * @typedef {Object} GetWeatherDataInput - The input type for the getWeatherData function.
 * @typedef {Object} GetWeatherDataOutput - The return type for the getWeatherData function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GetWeatherDataInputSchema = z.object({
    latitude: z.number(),
    longitude: z.number(),
    language: z.string().optional().describe('The language for the weather description. e.g., en, hi, bn, te, pa'),
});

export type GetWeatherDataInput = z.infer<typeof GetWeatherDataInputSchema>;

const WeatherDataSchema = z.object({
    temp: z.number(),
    feels_like: z.number(),
    weather: z.object({
        main: z.string(),
        description: z.string(),
        icon: z.string(),
    }),
    wind_speed: z.number(),
});

const ForecastDataSchema = z.object({
    day: z.string(),
    temp: z.number(),
    weather: z.object({
        main: z.string(),
        icon: z.string(),
    }),
});

const GetWeatherDataOutputSchema = z.object({
    current: WeatherDataSchema,
    forecast: z.array(ForecastDataSchema),
});

export type GetWeatherDataOutput = z.infer<typeof GetWeatherDataOutputSchema>;

export async function getWeatherData(input: GetWeatherDataInput): Promise<GetWeatherDataOutput> {
    return getWeatherDataFlow(input);
}

const getWeatherDataFlow = ai.defineFlow(
    {
        name: 'getWeatherDataFlow',
        inputSchema: GetWeatherDataInputSchema,
        outputSchema: GetWeatherDataOutputSchema,
    },
    async ({ latitude, longitude, language }) => {
        try {
            const apiKey = process.env.OPENWEATHER_API_KEY;
            if (!apiKey || apiKey === "YOUR_OPENWEATHER_API_KEY") {
                throw new Error('OpenWeatherMap API key is not configured. Please add it to your .env file.');
            }

            const langParam = language ? `&lang=${language}` : '';

            // Fetch current weather
            const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric${langParam}`;
            const currentResponse = await fetch(currentUrl);
            if (!currentResponse.ok) {
                const errorData = await currentResponse.json().catch(() => ({ message: 'Failed to fetch current weather data.' }));
                throw new Error(errorData.message || 'Failed to fetch current weather data.');
            }
            const currentData = await currentResponse.json();

            const current = {
                temp: currentData.main.temp,
                feels_like: currentData.main.feels_like,
                weather: {
                    main: currentData.weather[0].main,
                    description: currentData.weather[0].description,
                    icon: currentData.weather[0].icon,
                },
                wind_speed: currentData.wind.speed,
            };

            // Fetch forecast weather
            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric${langParam}`;
            const forecastResponse = await fetch(forecastUrl);
            if (!forecastResponse.ok) {
                const errorData = await forecastResponse.json().catch(() => ({ message: 'Failed to fetch forecast data.' }));
                throw new Error(errorData.message || 'Failed to fetch forecast data.');
            }
            const forecastData = await forecastResponse.json();
            
            const forecast: GetWeatherDataOutput['forecast'] = [];
            const seenDays = new Set();
            
            for (const item of forecastData.list) {
                const day = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
                if (!seenDays.has(day)) {
                    seenDays.add(day);
                    forecast.push({
                        day: day,
                        temp: item.main.temp,
                        weather: {
                            main: item.weather[0].main,
                            icon: item.weather[0].icon,
                        },
                    });
                }
                if (forecast.length === 5) {
                    break;
                }
            }
            
            return { current, forecast };
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error in getWeatherDataFlow: ", error.message);
                throw error;
            }
            console.error("An unknown error occurred in getWeatherDataFlow");
            throw new Error("An unknown error occurred while fetching weather data.");
        }
    }
);
