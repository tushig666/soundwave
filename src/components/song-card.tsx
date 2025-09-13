'use client';

import Image from 'next/image';
import { Play } from 'lucide-react';
import type { Song } from '@/lib/types';
import { usePlayer } from '@/hooks/use-player';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface SongCardProps {
  song: Song;
  playlist: Song[];
  className?: string;
}

export function SongCard({ song, playlist, className }: SongCardProps) {
  const { play, activeSong } = usePlayer();
  const isActive = activeSong?.id === song.id;

  const handlePlay = () => {
    play(song, playlist);
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
      <CardFooter className="flex-col items-start p-4">
        <h3 className="w-full truncate text-base font-semibold">
          {song.title}
        </h3>
        <p className="w-full truncate text-sm text-muted-foreground">
          {song.artist}
        </p>
      </CardFooter>
    </Card>
  );
}
