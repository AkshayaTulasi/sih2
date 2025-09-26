
"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";
import { Mic, MicOff, AlertCircle, Loader, User, Volume2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { answerQuestion, convertTextToSpeech } from "@/lib/actions";

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
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

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
        setTranscript(spokenText);
        handleSpokenText(spokenText);
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

  const handleSpokenText = async (text: string) => {
    if (!text) return;
    setLoading(true);
    setAiResponse("");
    setAudioSrc(null);
    const res = await answerQuestion({ question: text, language });

    if (res.success && res.data?.answer) {
      setAiResponse(res.data.answer);
      const audioRes = await convertTextToSpeech({ text: res.data.answer });
      if (audioRes.success && audioRes.data?.audioDataUri) {
        setAudioSrc(audioRes.data.audioDataUri);
      } else {
        toast({
          variant: "destructive",
          title: "Audio Error",
          description: audioRes.error || "Failed to generate audio response.",
        });
      }
    } else {
      setAiResponse("Sorry, I couldn't get an answer for that.");
      toast({
        variant: "destructive",
        title: "Error",
        description: res.error || "Failed to get an answer.",
      });
    }
    setLoading(false);
  };
  
  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setTranscript("");
      setAiResponse("");
      setAudioSrc(null);
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  useEffect(() => {
    if (audioSrc && audioRef.current) {
      audioRef.current.play();
    }
  }, [audioSrc]);

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

      {(loading || transcript || aiResponse) && (
        <Card className="text-left animate-in fade-in">
          <CardContent className="p-6 space-y-4">
            {transcript && (
              <div className="flex items-start gap-4">
                <User className="w-6 h-6 mt-1 text-primary" />
                <div className="flex-1">
                  <p className="font-semibold">{t('youSaid')}:</p>
                  <p className="text-muted-foreground">"{transcript}"</p>
                </div>
              </div>
            )}
            {loading && <Loader className="mx-auto my-4 w-7 h-7 animate-spin" />}
            {aiResponse && (
              <div className="flex items-start gap-4 pt-4 border-t">
                 <Volume2 className="w-6 h-6 mt-1 text-accent" />
                <div className="flex-1">
                  <p className="font-semibold">{t('aiResponse')}:</p>
                  <p className="text-muted-foreground">{aiResponse}</p>
                </div>
              </div>
            )}
            {audioSrc && <audio ref={audioRef} src={audioSrc} className="hidden" />}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
