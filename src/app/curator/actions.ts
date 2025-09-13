'use server';

import { generatePlaylist } from '@/ai/flows/ai-playlist-curator';
import { z } from 'zod';

const schema = z.object({
  listeningHistory: z.string().min(1, 'Please enter at least one song.'),
});

type FormState = {
  playlist: string | null;
  error: string | null;
};

export async function generateCuratedPlaylist(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const parsed = schema.safeParse({
      listeningHistory: formData.get('listeningHistory'),
    });

    if (!parsed.success) {
      return {
        playlist: null,
        error: parsed.error.errors[0].message,
      };
    }

    // Add a slight delay to show loading state
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const result = await generatePlaylist({
      listeningHistory: parsed.data.listeningHistory,
    });

    if (!result.playlist) {
      return {
        playlist: null,
        error: 'Could not generate a playlist. Please try again.',
      };
    }

    return {
      playlist: result.playlist,
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      playlist: null,
      error: 'An unexpected error occurred. Please try again later.',
    };
  }
}
