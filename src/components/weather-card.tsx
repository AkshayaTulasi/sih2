"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudHail,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Sun,
  Tornado,
  Wind,
  Thermometer,
  Loader,
  AlertCircle,
  TriangleAlert,
} from "lucide-react";
import { Separator } from "./ui/separator";
import { useLanguage } from "@/context/language-context";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { fetchWeatherData, generateWeatherAlertAction } from "@/lib/actions";
import type { GetWeatherDataOutput } from "@/ai/flows/get-weather-data";
import type { GenerateWeatherAlertOutput } from "@/ai/flows/generate-weather-alert";
import React from "react";
import { Badge } from "./ui/badge";

const weatherIconMapping: { [key: string]: React.ReactNode } = {
  "01d": <Sun className="w-6 h-6 text-orange-400" />,
  "01n": <Sun className="w-6 h-6 text-orange-400" />,
  "02d": <CloudSun className="w-6 h-6 text-yellow-400" />,
  "02n": <CloudSun className="w-6 h-6 text-yellow-400" />,
  "03d": <Cloud className="w-6 h-6 text-gray-400" />,
  "03n": <Cloud className="w-6 h-6 text-gray-400" />,
  "04d": <Cloud className="w-6 h-6 text-gray-400" />,
  "04n": <Cloud className="w-6 h-6 text-gray-400" />,
  "09d": <CloudDrizzle className="w-6 h-6 text-blue-400" />,
  "09n": <CloudDrizzle className="w-6 h-6 text-blue-400" />,
  "10d": <CloudRain className="w-6 h-6 text-blue-500" />,
  "10n": <CloudRain className="w-6 h-6 text-blue-500" />,
  "11d": <CloudLightning className="w-6 h-6 text-yellow-500" />,
  "11n": <CloudLightning className="w-6 h-6 text-yellow-500" />,
  "13d": <CloudSnow className="w-6 h-6 text-blue-200" />,
  "13n": <CloudSnow className="w-6 h-6 text-blue-200" />,
  "50d": <CloudFog className="w-6 h-6 text-gray-500" />,
  "50n": <CloudFog className="w-6 h-6 text-gray-500" />,
};

const dayMapping: { [key: string]: string } = {
  "Tue": "tue",
  "Wed": "wed",
  "Thu": "thu",
  "Fri": "fri",
  "Sat": "sat",
  "Sun": "sun",
  "Mon": "mon"
};


export function WeatherCard() {
  const { t, language } = useLanguage();
  const [location, setLocation] = useState<{city: string, state: string} | null>(null);
  const [weatherData, setWeatherData] = useState<GetWeatherDataOutput | null>(null);
  const [weatherAlert, setWeatherAlert] = useState<GenerateWeatherAlertOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            const geoResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const geoData = await geoResponse.json();
            const { city, state } = geoData.address;
            setLocation({ city, state });

            const weatherResponse = await fetchWeatherData({ latitude, longitude, language });
            if (weatherResponse.success && weatherResponse.data) {
              setWeatherData(weatherResponse.data);
              const alertResponse = await generateWeatherAlertAction({ weatherData: weatherResponse.data, language });
              if (alertResponse.success && alertResponse.data) {
                setWeatherAlert(alertResponse.data);
              }
            } else {
              setError(weatherResponse.error || t('weatherFetchError'));
            }

          } catch (err) {
             if (err instanceof Error) {
              setError(err.message);
            } else {
              setError(t('locationFetchError'));
            }
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          setError(t('locationAccessDenied'));
          setLoading(false);
        }
      );
    } else {
      setError(t('geolocationNotSupported'));
      setLoading(false);
    }
  }, [t, language]);
  
  const getWeatherIcon = (iconCode: string, large: boolean = false) => {
    const icon = weatherIconMapping[iconCode] || <Cloud className={`${large ? 'w-16 h-16' : 'w-6 h-6'} text-gray-400`} />;
    if (large) {
        return React.cloneElement(icon as React.ReactElement, { className: 'w-16 h-16' });
    }
    return icon;
  };

  const alertSeverityColor = {
    low: "bg-yellow-400",
    medium: "bg-orange-500",
    high: "bg-red-600",
    none: "hidden"
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('todaysWeather')}</CardTitle>
        <CardDescription>
          {loading ? t('fetchingLocation') : error ? t('weatherError') : location ? `${location.city}, ${location.state}`: t('locationFetchError')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader className="w-8 h-8 animate-spin" />
          </div>
        )}
        {error && !loading && (
          <Alert variant="destructive">
            <AlertCircle className="w-4 h-4" />
            <AlertTitle>{t('weatherError')}</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
        {!loading && !error && weatherData && (
          <>
            {weatherAlert && weatherAlert.alert && weatherAlert.severity !== 'none' && (
              <Alert variant={weatherAlert.severity === 'high' ? 'destructive' : 'default'} className="mb-4 bg-yellow-50 border-yellow-300 dark:bg-yellow-950 dark:border-yellow-800">
                <TriangleAlert className="h-4 w-4 text-yellow-600" />
                <AlertTitle className="text-yellow-800 dark:text-yellow-200">{t('weatherAlert')}</AlertTitle>
                <AlertDescription className="text-yellow-700 dark:text-yellow-300">
                  {weatherAlert.alert}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getWeatherIcon(weatherData.current.weather.icon, true)}
                <div>
                  <div className="text-5xl font-bold">{Math.round(weatherData.current.temp)}°C</div>
                  <div className="text-muted-foreground capitalize">{weatherData.current.weather.description}</div>
                </div>
              </div>
              <div className="space-y-2 text-sm text-right">
                <div className="flex items-center justify-end gap-2">
                  <Thermometer className="w-4 h-4 text-muted-foreground" />
                  <span>{t('feelsLike')} {Math.round(weatherData.current.feels_like)}°C</span>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Wind className="w-4 h-4 text-muted-foreground" />
                  <span>{(weatherData.current.wind_speed * 3.6).toFixed(1)} km/h</span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="mb-4 font-semibold text-center">{t('weeklyForecast')}</h4>
              <div className="flex justify-between">
                {weatherData.forecast.map((item) => (
                  <div key={item.day} className="flex flex-col items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">{t(dayMapping[item.day] || item.day.toLowerCase())}</span>
                    {getWeatherIcon(item.weather.icon)}
                    <span className="font-bold">{Math.round(item.temp)}°C</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
