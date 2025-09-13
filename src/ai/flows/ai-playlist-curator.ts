// This is an AI-powered playlist curator that suggests songs based on user's listening history.
'use server';

/**
 * @fileOverview AI-powered playlist curator.
 *
 * - generatePlaylist - A function that generates a playlist based on listening history.
 * - GeneratePlaylistInput - The input type for the generatePlaylist function.
 * - GeneratePlaylistOutput - The return type for the generatePlaylist function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePlaylistInputSchema = z.object({
  listeningHistory: z
    .string()
    .describe('The user listening history, comma separated song names.'),
});
export type GeneratePlaylistInput = z.infer<typeof GeneratePlaylistInputSchema>;

const GeneratePlaylistOutputSchema = z.object({
  playlist: z
    .string()
    .describe('A comma separated list of songs to add to the playlist.'),
});
export type GeneratePlaylistOutput = z.infer<typeof GeneratePlaylistOutputSchema>;

export async function generatePlaylist(input: GeneratePlaylistInput): Promise<GeneratePlaylistOutput> {
  return generatePlaylistFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePlaylistPrompt',
  input: {schema: GeneratePlaylistInputSchema},
  output: {schema: GeneratePlaylistOutputSchema},
  prompt: `You are a playlist curator. You will generate a playlist of songs based on the user's listening history.

Here is the listening history: {{{listeningHistory}}}

Suggest songs that are similar to the listening history and would be a good fit for the playlist. Output the songs as a comma separated list.
`,
});

const generatePlaylistFlow = ai.defineFlow(
  {
    name: 'generatePlaylistFlow',
    inputSchema: GeneratePlaylistInputSchema,
    outputSchema: GeneratePlaylistOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
