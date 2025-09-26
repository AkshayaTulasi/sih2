
"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";
import { Mic, MicOff, AlertCircle, Loader } from "lucide-react";
import { useEffect, useState, useRef } from "react";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function VoiceAssistant() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const checkMicPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasMicPermission(true);
        stream.getTracks().forEach(track => track.stop());
      } catch (error) {
        setHasMicPermission(false);
        console.error("Mic permission denied:", error);
      }
    };
    checkMicPermission();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language;

      recognitionRef.current.onresult = (event: any) => {
        const spokenText = event.results[0][0].transcript;
        toast({
          title: "Heard you!",
          description: `You said: "${spokenText}". This feature is a demo and does not process your request further.`
        })
      };

      recognitionRef.current.onerror = (event: any) => {
        if (event.error === 'no-speech') {
            console.log("No speech detected. Stopping recording.");
        } else {
            console.error("Speech recognition error", event.error);
            toast({
              variant: "destructive",
              title: "Speech Recognition Error",
              description: event.error,
            });
        }
        setIsRecording(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    } else {
      toast({
        variant: "destructive",
        title: "Browser Not Supported",
        description: "Your browser does not support speech recognition.",
      });
    }
  }, [language, toast]);
  
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language;
    }
  }, [language]);

  
  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  if (hasMicPermission === null) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  if (hasMicPermission === false) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="w-4 h-4" />
        <AlertTitle>{t('microphoneAccessDenied')}</AlertTitle>
        <AlertDescription>{t('microphoneAccessDeniedDescription')}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-center">
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl font-headline">
        {t('voiceAssistant')}
      </h1>
      <p className="text-muted-foreground">{t('voiceAssistantDescription')}</p>

      <Button
        onClick={toggleRecording}
        size="lg"
        className={`rounded-full w-24 h-24 ${isRecording ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary/90"}`}
      >
        {isRecording ? <MicOff size={40} /> : <Mic size={40} />}
      </Button>
      <p className="text-sm text-muted-foreground">
        {isRecording ? t('listening') : t('tapToSpeak')}
      </p>

    </div>
  );
}
