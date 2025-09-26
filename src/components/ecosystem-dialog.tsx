"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "./ui/button";
import { useLanguage } from "@/context/language-context";
import { Building, HeartHandshake, Rocket, Users, Handshake } from "lucide-react";

export function EcosystemDialog() {
  const { t } = useLanguage();

  const ecosystemPartners = [
    {
      name: "Agricultural Extension Officers",
      icon: <Users className="w-6 h-6 text-primary" />,
      problem: "Extension officers often have to support many farmers with limited resources and time.",
      solution: [
        "Provides real-time crop advisory (pest alerts, weather-based suggestions, fertilizer schedules) that officers can share directly with farmers.",
        "Enables digital record-keeping of farmer interactions and crop conditions.",
        "Facilitates two-way communication (farmers can raise queries via the app, which officers monitor and respond to).",
        "Helps officers train farmers at scale using localized content, videos, and AI-driven advice."
      ]
    },
    {
      name: "Government Agriculture Departments",
      icon: <Building className="w-6 h-6 text-primary" />,
      problem: "Need large-scale monitoring, policy implementation, and farmer support.",
      solution: [
        "Data collection & analysis: Aggregates field-level data (yields, soil conditions, pest outbreaks) for better policymaking.",
        "Scheme dissemination: Pushes government program details, subsidies, and updates to farmers digitally.",
        "Monitoring impact: Departments can measure adoption of schemes, training sessions, and farmer outcomes.",
        "Disaster management: Early warnings (floods, droughts, locusts) can be broadcast instantly."
      ]
    },
    {
      name: "NGOs and Cooperatives",
      icon: <HeartHandshake className="w-6 h-6 text-primary" />,
      problem: "NGOs need to improve farmer livelihoods and cooperatives must ensure member productivity and profitability.",
      solution: [
        "Training & awareness campaigns: Share sustainable farming practices, organic methods, and climate-resilient practices.",
        "Collective decision-making: Helps cooperatives track member crops, plan collective sales, and negotiate better market prices.",
        "Financial inclusion: Integrates with microcredit, insurance, and loan services, making it easier for NGOs to connect farmers.",
        "Impact measurement: NGOs can use app data to report outcomes to donors (yields improved, income levels increased, adoption of practices)."
      ]
    },
    {
      name: "Agri-Tech Startups",
      icon: <Rocket className="w-6 h-6 text-primary" />,
      problem: "Startups need farmer adoption and integration with other agri-value chain players.",
      solution: [
        "Farmer engagement platform: Startups can use it to deliver precision agri-advice, farm input recommendations, and crop management tools.",
        "Marketplace integration: Links farmers to buyers, e-commerce platforms, or fintech services through the app.",
        "API ecosystem: Startups can plug in their services (weather API, soil testing kits, drone services) into AgriAssist.",
        "Scalability: Reduces customer acquisition costs by serving as a ready-to-use platform to reach thousands of farmers."
      ]
    },
  ];


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full py-6 text-lg">
          <Handshake className="w-6 h-6 mr-2" />
          Our Ecosystem
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Our Agricultural Ecosystem</DialogTitle>
          <DialogDescription>
            AgriAssist is designed to empower not just farmers, but the entire agricultural value chain. Here's how we help different stakeholders.
          </DialogDescription>
        </DialogHeader>
        <Accordion type="single" collapsible className="w-full">
          {ecosystemPartners.map((partner) => (
            <AccordionItem value={partner.name} key={partner.name}>
              <AccordionTrigger>
                <div className="flex items-center gap-3">
                  {partner.icon}
                  <span className="font-semibold">{partner.name}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-2">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-destructive">Problem:</h4>
                    <p className="text-muted-foreground">{partner.problem}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary">How AgriAssist Helps:</h4>
                    <ul className="mt-2 space-y-2 list-disc list-inside text-muted-foreground">
                      {partner.solution.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </DialogContent>
    </Dialog>
  );
}
