'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { generateCuratedPlaylist } from './actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ListMusic, Loader2, Music, WandSparkles } from 'lucide-react';

const initialState = {
  playlist: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <WandSparkles className="mr-2 h-4 w-4" />
      )}
      Generate Playlist
    </Button>
  );
}

export default function CuratorPage() {
  const [state, formAction] = useFormState(
    generateCuratedPlaylist,
    initialState
  );

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex items-center gap-4">
        <WandSparkles className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">AI Playlist Curator</h1>
      </div>
      <p className="mb-8 max-w-2xl text-muted-foreground">
        Feeling uninspired? Let our AI curator craft the perfect playlist for
        you. Just paste in some songs you like, and we'll handle the rest,
        suggesting new tracks that match your vibe.
      </p>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Create Your Playlist</CardTitle>
            <CardDescription>
              Enter a few songs you like, separated by commas, to get started.
            </CardDescription>
          </CardHeader>
          <form action={formAction}>
            <CardContent>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="listeningHistory">Your favorite songs</Label>
                <Textarea
                  id="listeningHistory"
                  name="listeningHistory"
                  placeholder="e.g., Blinding Lights - The Weeknd, As It Was - Harry Styles, Bohemian Rhapsody - Queen"
                  rows={5}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <SubmitButton />
            </CardFooter>
          </form>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Generated Playlist</CardTitle>
            <CardDescription>
              Here are the tracks our AI thinks you'll love.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            {state.error && (
              <p className="text-destructive">{state.error}</p>
            )}

            {state.playlist && (
              <ul className="space-y-3">
                {state.playlist.split(',').map((song, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 rounded-md p-2 hover:bg-secondary/50"
                  >
                    <Music className="h-5 w-5 text-muted-foreground" />
                    <span className="flex-1">{song.trim()}</span>
                    <Button variant="ghost" size="sm">
                      Add to queue
                    </Button>
                  </li>
                ))}
              </ul>
            )}

            {!state.playlist && !state.error && (
              <div className="flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8 text-center text-muted-foreground">
                <ListMusic className="mb-4 h-12 w-12" />
                <p>Your generated playlist will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
