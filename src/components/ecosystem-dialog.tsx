
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
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "./ui/skeleton";
import { communityFormSchema, type CommunityFormInput } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { answerQuestion } from "@/lib/actions";
import { Loader, Send, User, Users } from "lucide-react";

interface Post {
  id: number;
  question: string;
  answer: string | null;
  loading: boolean;
}

export function EcosystemDialog() {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const { toast } = useToast();

  const form = useForm<CommunityFormInput>({
    resolver: zodResolver(communityFormSchema),
    defaultValues: {
      question: "",
    },
  });

  async function onSubmit(values: CommunityFormInput) {
    setLoading(true);
    const newPost: Post = {
      id: Date.now(),
      question: values.question,
      answer: null,
      loading: true,
    };
    setPosts([newPost, ...posts]);
    form.reset();

    const res = await answerQuestion({ question: values.question, language });

    if (res.success && res.data) {
      setPosts(prevPosts => prevPosts.map(p => p.id === newPost.id ? {...p, answer: res.data!.answer, loading: false} : p));
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: res.error || "Failed to get answer.",
      });
       setPosts(prevPosts => prevPosts.map(p => p.id === newPost.id ? {...p, answer: "Sorry, I could not process your request.", loading: false} : p));
    }
    setLoading(false);
  }

  const extensionOfficerInfo = {
      name: "Agricultural Extension Officers",
      icon: <Users className="w-6 h-6 text-primary" />,
      problem: "Extension officers often have to support many farmers with limited resources and time.",
      solution: [
        "Provides real-time crop advisory (pest alerts, weather-based suggestions, fertilizer schedules) that officers can share directly with farmers.",
        "Enables digital record-keeping of farmer interactions and crop conditions.",
        "Facilitates two-way communication (farmers can raise queries via the app, which officers monitor and respond to).",
        "Helps officers train farmers at scale using localized content, videos, and AI-driven advice."
      ]
  };

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
        <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <div className="flex items-center gap-3">
                {extensionOfficerInfo.icon}
                <span className="font-semibold">{extensionOfficerInfo.name}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-2">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-destructive">Problem:</h4>
                  <p className="text-muted-foreground">{extensionOfficerInfo.problem}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary">How AgriAssist Helps:</h4>
                  <ul className="mt-2 space-y-2 list-disc list-inside text-muted-foreground">
                    {extensionOfficerInfo.solution.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              <span className="font-semibold">Live Demo: Two-Way Communication</span>
            </AccordionTrigger>
            <AccordionContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Simulate a farmer asking a question. The AI response represents how an officer could quickly provide expert advice.
              </p>
              <Card>
                <CardContent className="p-4">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                       <FormField
                          control={form.control}
                          name="question"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('askQuestion')}</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder={t('questionPlaceholder')}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                      <Button type="submit" disabled={loading} size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                        {loading ? (
                          <Loader className="animate-spin" />
                        ) : (
                          <Send />
                        )}
                        {t('submitQuestion')}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              <div className="mt-4 space-y-4">
                {posts.map(post => (
                  <Card key={post.id} className="animate-in fade-in">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarFallback><User /></AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-base">{t('question')}</CardTitle>
                          <p className="text-sm text-muted-foreground">{post.question}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {post.loading ? (
                        <div className="space-y-2">
                          <Skeleton className="w-full h-4" />
                          <Skeleton className="w-2/3 h-4" />
                        </div>
                      ) : (
                        <div className="flex items-start gap-4 p-4 mt-4 border-t">
                          <Avatar className="bg-primary/10">
                            <AvatarFallback className="text-primary font-bold text-xs">AI</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{t('answer')}</p>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{post.answer}</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </DialogContent>
    </Dialog>
  );
}
