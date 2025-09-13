
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSongStore } from '@/lib/store';
import { SongCard } from '@/components/song-card';
import { Input } from '@/components/ui/input';
import { Search, Music } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { AppLayout } from '@/components/layout/app-layout';

export default function SearchPage() {
  const { songs, fetchSongs } = useSongStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSongs = async () => {
      setIsLoading(true);
      await fetchSongs();
      setIsLoading(false);
    };
    if (songs.length === 0) {
      loadSongs();
    } else {
      setIsLoading(false);
    }
  }, [fetchSongs, songs.length]);

  const filteredSongs = useMemo(() => {
    if (!searchQuery) {
      // Initially show all public songs
      return songs.filter((song) => song.isPublic);
    }
    return songs.filter(
      (song) =>
        song.isPublic &&
        (song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
          song.genre.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [songs, searchQuery]);

  return (
    <AppLayout>
      <div className="p-4 md:p-6">
        <div className="mb-6 flex items-center gap-4">
          <Search className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Search</h1>
        </div>

        <div className="relative mb-8 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for songs, artists, genres..."
            className="w-full pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <section>
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
          ) : filteredSongs.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {filteredSongs.map((song) => (
                <SongCard key={song.id} song={song} playlist={filteredSongs} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-12 text-center">
              <Music className="h-12 w-12 text-muted-foreground" />
              <h2 className="mt-4 text-xl font-semibold">No Results Found</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Try a different search term.
              </p>
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}
