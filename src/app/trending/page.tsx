
'use client';

import { SongCard } from '@/components/song-card';
import { useSongStore } from '@/lib/store';
import { TrendingUp } from 'lucide-react';

export default function TrendingPage() {
  const songs = useSongStore((state) => state.songs);
  // Sort songs by likes in descending order to determine what's trending
  const trendingSongs = [...songs]
    .filter((song) => song.isPublic)
    .sort((a, b) => b.likes - a.likes);

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex items-center gap-4">
        <TrendingUp className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Trending</h1>
      </div>
      
      <section>
        <p className="mb-8 max-w-2xl text-muted-foreground">
          Discover the most popular tracks on SoundWave right now.
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {trendingSongs.map((song) => (
            <SongCard key={song.id} song={song} playlist={trendingSongs} />
          ))}
        </div>
      </section>
    </div>
  );
}
