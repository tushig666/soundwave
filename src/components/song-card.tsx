
'use client';

import Image from 'next/image';
import { Play, ListPlus, MoreVertical, X } from 'lucide-react';
import type { Song, Playlist } from '@/lib/types';
import { usePlayer } from '@/hooks/use-player';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useSongStore } from '@/lib/store';
import { useAuth } from '@/hooks/use-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface SongCardProps {
  song: Song;
  playlist: Song[];
  className?: string;
  onRemoveFromPlaylist?: (songId: string) => void;
  playlistId?: string;
}

export function SongCard({ song, playlist, className, onRemoveFromPlaylist, playlistId }: SongCardProps) {
  const { play, activeSong } = usePlayer();
  const { user } = useAuth();
  const { playlists, addSongToPlaylist } = useSongStore();
  const { toast } = useToast();
  const isActive = activeSong?.id === song.id;

  const handlePlay = () => {
    play(song, playlist);
  };

  const handleAddSong = async (playlistId: string) => {
    if (!user) {
        toast({ title: "Login required", variant: "destructive" });
        return;
    }
    try {
        await addSongToPlaylist(playlistId, song.id);
        const targetPlaylist = playlists.find(p => p.id === playlistId);
        toast({ title: "Success!", description: `Added "${song.title}" to "${targetPlaylist?.name}".` });
    } catch (error: any) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const placeholder = PlaceHolderImages.find((p) => p.imageUrl === song.coverUrl) ?? {
    imageHint: 'album cover',
  };

  return (
    <Card
      className={cn(
        'group w-full overflow-hidden transition-colors hover:bg-secondary/50',
        isActive && 'bg-secondary/80',
        className
      )}
    >
      <CardContent className="p-0">
        <div className="relative aspect-square">
          <Image
            src={song.coverUrl}
            alt={song.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            data-ai-hint={placeholder.imageHint}
          />
          <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/40" />
          <Button
            variant="default"
            size="icon"
            className="absolute bottom-4 right-4 h-12 w-12 translate-y-2 rounded-full shadow-lg opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
            onClick={handlePlay}
          >
            <Play className="h-6 w-6 fill-background" />
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex items-start p-4">
        <div className="flex-1">
          <h3 className="w-full truncate text-base font-semibold">
            {song.title}
          </h3>
          <p className="w-full truncate text-sm text-muted-foreground">
            {song.artist}
          </p>
        </div>
         {user && (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <ListPlus className="mr-2 h-4 w-4" />
                            Add to Playlist
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuLabel>Your Playlists</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {playlists.length > 0 ? playlists.map(p => (
                                    <DropdownMenuItem key={p.id} onSelect={() => handleAddSong(p.id)}>
                                        {p.name}
                                    </DropdownMenuItem>
                                )) : (
                                    <DropdownMenuItem disabled>No playlists found</DropdownMenuItem>
                                )}
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    {onRemoveFromPlaylist && playlistId && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => onRemoveFromPlaylist(song.id)} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                           <X className="mr-2 h-4 w-4"/>
                           Remove from this playlist
                        </DropdownMenuItem>
                      </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
         )}
      </CardFooter>
    </Card>
  );
}
