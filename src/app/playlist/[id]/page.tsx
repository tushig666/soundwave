
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import { useSongStore } from '@/lib/store';
import type { Playlist as PlaylistType } from '@/lib/types';
import { AuthRequired } from '@/components/auth-required';
import { SongCard } from '@/components/song-card';
import { Button } from '@/components/ui/button';
import { Music, ListMusic, User, ArrowLeft, Trash2, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';
import { AppLayout } from '@/components/layout/app-layout';

function PlaylistHeaderSkeleton() {
  return (
    <header className="mb-8 flex flex-col items-center gap-6 md:flex-row">
        <Skeleton className="relative h-32 w-32 shrink-0 md:h-48 md:w-48 rounded-lg" />
        <div className="flex flex-col items-center gap-2 text-center md:items-start md:text-left">
           <Skeleton className="h-10 w-64" />
           <Skeleton className="h-5 w-48" />
           <Skeleton className="h-5 w-32" />
        </div>
    </header>
  );
}

function SongGridSkeleton() {
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
    )
}

export default function PlaylistPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const { getPlaylistById, removeSongFromPlaylist, playlists, fetchPlaylists } = useSongStore();
  const [playlist, setPlaylist] = useState<PlaylistType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPlaylistDetails = useCallback(async () => {
    if (typeof id !== 'string' || !user) return;
    setIsLoading(true);
    const fetchedPlaylist = await getPlaylistById(id);
    if (fetchedPlaylist) {
        if(fetchedPlaylist.ownerId !== user.uid) {
            toast({ title: "Access Denied", description: "You don't have permission to view this playlist.", variant: "destructive" });
            router.push('/trending');
        } else {
            setPlaylist(fetchedPlaylist);
        }
    } else {
        toast({ title: "Not Found", description: "This playlist does not exist.", variant: "destructive" });
        router.push('/trending');
    }
    setIsLoading(false);
  }, [id, user, getPlaylistById, router, toast]);

  useEffect(() => {
    fetchPlaylistDetails();
  }, [fetchPlaylistDetails]);


  const handleRemoveSong = async (songId: string) => {
    if (!playlist) return;
    try {
      await removeSongFromPlaylist(playlist.id, songId);
      // Optimistically update the UI
      setPlaylist(prev => prev ? ({
        ...prev,
        songs: prev.songs?.filter(s => s.id !== songId)
      }) : null);
      toast({ title: "Song removed from playlist." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };


  return (
    <AuthRequired>
      <AppLayout>
        <div className="p-4 md:p-6">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
          </Button>
          {isLoading ? (
            <>
              <PlaylistHeaderSkeleton />
              <SongGridSkeleton />
            </>
          ) : !playlist ? (
            <div className="text-center">Playlist not found.</div>
          ) : (
            <>
              <header className="mb-8 flex flex-col items-center gap-6 md:flex-row">
                  <div className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-lg bg-muted shadow-lg md:h-48 md:w-48">
                      <ListMusic className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col items-center gap-2 text-center md:items-start md:text-left">
                  <h1 className="text-4xl font-bold">{playlist.name}</h1>
                  <p className="max-w-md text-muted-foreground">
                      Created by you &bull; {playlist.songs?.length || 0} songs
                  </p>
                  {playlist.description && (
                      <p className="max-w-md text-sm text-muted-foreground">{playlist.description}</p>
                  )}
                  </div>
              </header>
              
              <section>
                  {playlist.songs && playlist.songs.length > 0 ? (
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                      {playlist.songs.map((song) => (
                        <SongCard 
                          key={song.id} 
                          song={song} 
                          playlist={playlist.songs!} 
                          onRemoveFromPlaylist={handleRemoveSong}
                          playlistId={playlist.id}
                        />
                      ))}
                    </div>
                  ) : (
                      <div className="flex h-48 flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8 text-center text-muted-foreground">
                          <Music className="h-12 w-12" />
                          <h2 className="mt-4 text-xl font-semibold">This playlist is empty</h2>
                          <p className="mt-2 text-sm">
                              Find some songs to add to your playlist!
                          </p>
                      </div>
                  )}
              </section>
            </>
          )}
        </div>
      </AppLayout>
    </AuthRequired>
  );
}
