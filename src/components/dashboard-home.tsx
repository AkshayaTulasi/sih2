"use client";

import { useLanguage } from "@/context/language-context";
import { MarketWatch } from "./market-watch";
import { WeatherCard } from "./weather-card";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Building, HeartHandshake, Rocket, Users } from "lucide-react";

export function DashboardHome() {
  const { t } = useLanguage();
  const ecosystemPartners = [
    {
      name: "Agricultural extension officers",
      icon: <Users className="w-6 h-6 text-primary" />,
    },
    {
      name: "Government agriculture departments",
      icon: <Building className="w-6 h-6 text-primary" />,
    },
    {
      name: "NGOs and cooperatives",
      icon: <HeartHandshake className="w-6 h-6 text-primary" />,
    },
    {
      name: "Agri-tech startups",
      icon: <Rocket className="w-6 h-6 text-primary" />,
    },
  ];

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
          <CardTitle>Our Ecosystem</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {ecosystemPartners.map((partner) => (
              <div key={partner.name} className="flex items-center gap-4 p-4 rounded-lg bg-background/80">
                {partner.icon}
                <span className="font-medium">{partner.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
