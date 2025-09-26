"use client";

import { useLanguage } from "@/context/language-context";
import { MarketWatch } from "./market-watch";
import { WeatherCard } from "./weather-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Handshake } from "lucide-react";
import { EcosystemDialog } from "./ecosystem-dialog";
import { GovernmentSchemes } from "./government-schemes";
import { NgoCooperativeDialog } from "./ngo-cooperative-dialog";
import { AgritechStartupDialog } from "./agritech-startup-dialog";

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
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Handshake className="w-6 h-6" />
            Our Ecosystem
          </CardTitle>
          <CardDescription>
            AgriAssist is designed to empower not just farmers, but the entire agricultural value chain.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <EcosystemDialog />
          <GovernmentSchemes />
          <NgoCooperativeDialog />
          <AgritechStartupDialog />
        </CardContent>
      </Card>
    </div>
  );
}
