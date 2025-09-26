"use client";

import { useLanguage } from "@/context/language-context";
import { MarketWatch } from "./market-watch";
import { WeatherCard } from "./weather-card";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Building, HeartHandshake, Rocket, Users } from "lucide-react";
import { EcosystemDialog } from "./ecosystem-dialog";

export function DashboardHome() {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl font-headline">
          {t('welcomeToAgriAssist')}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t('welcomeMessage')}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <WeatherCard />
        </div>
        <div className="lg:col-span-2">
          <MarketWatch />
        </div>
      </div>
      
      <EcosystemDialog />
    </div>
  );
}
