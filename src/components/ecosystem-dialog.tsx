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
import { Users } from "lucide-react";

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
  ];


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full py-6 text-base">
          <Users className="w-6 h-6 mr-2" />
          Agri. Extension Officers
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">For Agricultural Extension Officers</DialogTitle>
          <DialogDescription>
            Here's how AgriAssist empowers officers to support farmers more effectively.
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
