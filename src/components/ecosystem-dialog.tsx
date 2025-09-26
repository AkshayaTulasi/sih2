
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useLanguage } from "@/context/language-context";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Textarea } from "./ui/textarea";
import { communityFormSchema, type CommunityFormInput } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Loader, Send, User, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface Post {
  id: number;
  question: string;
}

export function EcosystemDialog() {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full py-6 text-base">
          <Users className="w-6 h-6 mr-2" />
          Agri. Extension Officers
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Users />
            Ask an Extension Officer
            </DialogTitle>
          <DialogDescription>
            Get practical, field-level advice from an experienced Agricultural Extension Officer. Your question will be posted for an officer to answer.
          </DialogDescription>
        </DialogHeader>
        
        <Card>
            <CardContent className="p-4">
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="question"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Your Question</FormLabel>
                            <FormControl>
                            <Textarea
                                placeholder="e.g., 'What's the best way to prepare my soil for monsoon planting?'"
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
                    Post Question
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
                    <CardTitle className="text-base">Your Question</CardTitle>
                    <p className="text-sm text-muted-foreground">{post.question}</p>
                </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-start gap-4 p-4 mt-4 border-t">
                  <Avatar className="bg-primary/10">
                    <AvatarFallback className="text-primary font-bold text-xs">EO</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Awaiting Answer</p>
                    <p className="text-xs text-muted-foreground">An Extension Officer will answer your question shortly.</p>
                  </div>
                </div>
            </CardContent>
            </Card>
        ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
