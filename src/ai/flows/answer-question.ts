'use server';

/**
 * @fileOverview Answers user questions related to agriculture from different personas.
 *
 * @function answerQuestion - The main function to answer a question.
 * @typedef {Object} AnswerQuestionInput - The input type for the answerQuestion function.
 * @typedef {Object} AnswerQuestionOutput - The return type for the answerQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerQuestionInputSchema = z.object({
  question: z.string().describe("The user's question about agriculture."),
  context: z.string().optional().describe('Optional context from previous questions or posts.'),
  language: z.string().optional().describe('The language to respond in. e.g., en, hi, bn, te'),
  persona: z.string().optional().describe('A description of the persona the AI should adopt for the answer.'),
});

export type AnswerQuestionInput = z.infer<typeof AnswerQuestionInputSchema>;

const AnswerQuestionOutputSchema = z.object({
  answer: z.string().describe("A helpful and accurate answer to the user's question."),
});

export type AnswerQuestionOutput = z.infer<typeof AnswerQuestionOutputSchema>;

export async function answerQuestion(input: AnswerQuestionInput): Promise<AnswerQuestionOutput> {
  return answerQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerQuestionPrompt',
  input: {
    schema: AnswerQuestionInputSchema,
  },
  output: {
    schema: AnswerQuestionOutputSchema,
  },
  prompt: `
  {{#if persona}}
  You are an AI assistant representing {{persona}}. Your role is to provide helpful and accurate answers to a farmer's questions about agriculture from that perspective.
  {{else}}
  You are an AI assistant for a community forum of farmers. Your role is to provide helpful and accurate answers to their questions about agriculture. Be friendly and supportive in your tone.
  {{/if}}
  
  {{#if language}}
  Your response must be in the following language: {{language}}
  {{/if}}

  A farmer has asked the following question:
  "{{{question}}}"
  
  {{#if context}}
  Here is some previous context from the forum:
  "{{{context}}}"
  {{/if}}

  Please provide a clear and concise answer to the farmer's question. If the question is outside the scope of agriculture, politely decline to answer.
  `, 
});

const answerQuestionFlow = ai.defineFlow(
  {
    name: 'answerQuestionFlow',
    inputSchema: AnswerQuestionInputSchema,
    outputSchema: AnswerQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      return { answer: "Sorry, I couldn't come up with an answer for that." };
    }
    return output;
  }
);
