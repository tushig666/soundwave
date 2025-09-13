
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useSongStore } from '@/lib/store';
import type { Song } from '@/lib/types';
import { AuthRequired } from '@/components/auth-required';
import { SongCard } from '@/components/song-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Library, Heart, User, Music } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

function SongGrid({ songs, playlist, isLoading }: { songs: Song[], playlist: Song[], isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="aspect-square w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (songs.length === 0) {
    return (
       <div className="flex h-48 flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8 text-center text-muted-foreground">
        <Music className="h-12 w-12" />
        <p className="mt-4">No songs found in this section.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {songs.map((song) => (
        <SongCard key={song.id} song={song} playlist={playlist} />
      ))}
    </div>
  );
}


export default function LibraryPage() {
  const { user } = useAuth();
  const { songs, getUserSongs, getLikedSongs } = useSongStore();
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const [userSongs, setUserSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      const fetchLibraryData = async () => {
        const [liked, uploaded] = await Promise.all([
            getLikedSongs(user.uid),
            getUserSongs(user.uid)
        ]);
        setLikedSongs(liked);
        setUserSongs(uploaded);
        setIsLoading(false);
      };
      fetchLibraryData();
    }
  }, [user, songs, getLikedSongs, getUserSongs]); // re-run when global songs change


  return (
    <AuthRequired>
      <div className="p-4 md:p-6">
        <div className="mb-6 flex items-center gap-4">
          <Library className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Your Library</h1>
        </div>
        
        <Tabs defaultValue="liked" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-2 md:max-w-md">
            <TabsTrigger value="liked">
              <Heart className="mr-2 h-4 w-4" />
              Liked Songs
            </TabsTrigger>
            <TabsTrigger value="uploads">
              <User className="mr-2 h-4 w-4" />
              My Uploads
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="liked">
             <h2 className="text-2xl font-semibold mb-4">Liked Songs</h2>
             <SongGrid songs={likedSongs} playlist={likedSongs} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="uploads">
             <h2 className="text-2xl font-semibold mb-4">My Uploads</h2>
             <SongGrid songs={userSongs} playlist={userSongs} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </div>
    </AuthRequired>
  );
}
