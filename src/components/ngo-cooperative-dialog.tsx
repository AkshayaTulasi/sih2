
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
import { HeartHandshake, Loader, Send, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { communityFormSchema, type CommunityFormInput } from "@/lib/types";
import { answerQuestionAction } from "@/lib/actions";
import { Skeleton } from "./ui/skeleton";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface Post {
  id: number;
  question: string;
  answer: string | null;
  loading: boolean;
}

export function NgoCooperativeDialog() {
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

    const res = await answerQuestionAction({
      question: values.question,
      language,
      persona: "an NGO or Cooperative representative focused on community empowerment, sustainable practices, and collective action",
    });

    if (res.success && res.data) {
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === newPost.id ? { ...p, answer: res.data!.answer, loading: false } : p
        )
      );
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: res.error || "Failed to get answer.",
      });
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === newPost.id
            ? { ...p, answer: "Sorry, I could not process your request.", loading: false }
            : p
        )
      );
    }
    setLoading(false);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full h-full py-6 text-base">
          <HeartHandshake className="w-6 h-6 mr-2" />
          NGOs &amp; Cooperatives
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <HeartHandshake />
            Ask an NGO / Cooperative
          </DialogTitle>
          <DialogDescription>
            Get advice on sustainable farming, community projects, and collective marketing from an NGO/Cooperative perspective.
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
                          placeholder="e.g., 'How can our village start a farmer's cooperative?'"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={loading} size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  {loading ? <Loader className="animate-spin" /> : <Send />}
                  Ask Question
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="mt-4 space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="animate-in fade-in">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarFallback>
                      <User />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-base">Your Question</CardTitle>
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
                      <AvatarFallback className="text-primary font-bold text-xs">NGO</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">Representative's Answer</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {post.answer}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
