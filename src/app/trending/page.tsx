
'use client';

import { useEffect } from 'react';
import { SongCard } from '@/components/song-card';
import { useSongStore } from '@/lib/store';
import { Flame } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function TrendingPage() {
  const { songs, fetchSongs } = useSongStore();
  
  useEffect(() => {
    // Fetch songs on initial render
    fetchSongs();
  }, [fetchSongs]);

  // Sort songs by likes in descending order to determine what's trending
  const trendingSongs = [...songs]
    .filter((song) => song.isPublic)
    .sort((a, b) => b.likes - a.likes);

  const isLoading = songs.length === 0;

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex items-center gap-4">
        <Flame className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Trending</h1>
      </div>
      
      <section>
        <p className="mb-8 max-w-2xl text-muted-foreground">
          Discover the most popular tracks on SoundWave right now. These are the songs with the most likes from the community.
        </p>
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-square w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {trendingSongs.map((song) => (
              <SongCard key={song.id} song={song} playlist={trendingSongs} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
