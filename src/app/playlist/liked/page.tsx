
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useSongStore } from '@/lib/store';
import type { Song } from '@/lib/types';
import { AuthRequired } from '@/components/auth-required';
import { SongCard } from '@/components/song-card';
import { Heart, Music } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { AppLayout } from '@/components/layout/app-layout';

export default function LikedSongsPage() {
  const { user } = useAuth();
  const { songs, getLikedSongs } = useSongStore();
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      getLikedSongs(user.uid).then((songs) => {
        setLikedSongs(songs);
        setIsLoading(false);
      });
    }
  }, [user, songs, getLikedSongs]); // Re-run if global songs change (e.g., a like is toggled)

  return (
    <AuthRequired>
      <AppLayout>
        <div className="p-4 md:p-6">
          <div className="mb-6 flex items-center gap-4">
            <Heart className="h-8 w-8 text-red-500" />
            <h1 className="text-3xl font-bold">Liked Songs</h1>
          </div>

          <p className="mb-8 max-w-2xl text-muted-foreground">
            All the tracks you've liked, all in one place.
          </p>

          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-square w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : likedSongs.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {likedSongs.map((song) => (
                <SongCard key={song.id} song={song} playlist={likedSongs} />
              ))}
            </div>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-12 text-center text-muted-foreground">
              <Music className="h-12 w-12" />
              <h2 className="mt-4 text-xl font-semibold">No Liked Songs Yet</h2>
              <p className="mt-2 text-sm">
                Click the heart icon on a song to save it here.
              </p>
            </div>
          )}
        </div>
      </AppLayout>
    </AuthRequired>
  );
}
