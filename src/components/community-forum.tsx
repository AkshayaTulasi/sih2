
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Send, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  communityFormSchema,
  type CommunityFormInput,
} from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/context/language-context";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface Post {
  id: number;
  question: string;
}

export function CommunityForum() {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const { t } = useLanguage();

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
    };
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    setPosts([newPost, ...posts]);
    form.reset();
    setLoading(false);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl font-headline">
          {t('communityForum')}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t('communityForumDescription')}
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
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

              <Button type="submit" disabled={loading} className="w-full md:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
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
      
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight text-center font-headline">{t('recentPosts')}</h2>

        {posts.length === 0 && (
          <p className="text-center text-muted-foreground">{t('noPosts')}</p>
        )}

        {posts.map(post => (
          <Card key={post.id} className="animate-in fade-in">
            <CardHeader>
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarFallback><User /></AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{t('question')}</CardTitle>
                  <p className="text-muted-foreground">{post.question}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4 p-4 mt-4 border-t">
                <Avatar className="bg-primary/10">
                  <AvatarFallback className="text-primary font-bold text-sm">AI</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">{t('answer')}</p>
                  <p className="text-xs text-muted-foreground">Your question has been posted. An expert will answer it shortly.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
