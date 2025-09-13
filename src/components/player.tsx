
'use client';

import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Shuffle,
  Repeat,
  VolumeX,
  Heart,
} from 'lucide-react';
import Image from 'next/image';
import { usePlayer } from '@/hooks/use-player';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useState, useEffect } from 'react';
import { useSongStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import type { Song } from '@/lib/types';

export function Player() {
  const {
    activeSong,
    isPlaying,
    togglePlay,
    playNext,
    playPrev,
    progress,
    duration,
    handleProgressChange,
    volume,
    isMuted,
    handleVolumeChange,
    toggleMute,
  } = usePlayer();

  const { songs, toggleLike } = useSongStore();

  const currentSongDetails = songs.find((s) => s.id === activeSong?.id);

  const handleLike = () => {
    if (!currentSongDetails) return;
    toggleLike(currentSongDetails.id);
  };

  const songImage = PlaceHolderImages.find((p) => p.id === 'song-cover-1') ?? {
    imageUrl: 'https://picsum.photos/seed/100/64/64',
    imageHint: 'album cover',
  };

  if (!activeSong) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 flex h-24 items-center justify-center border-t border-border bg-card px-4">
        <p className="text-muted-foreground">No song selected</p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-24 items-center justify-between border-t border-border bg-card px-4 md:px-6">
      <div className="flex w-1/4 items-center gap-4">
        <Image
          src={activeSong.coverUrl}
          alt={activeSong.title}
          width={64}
          height={64}
          className="rounded-md"
          data-ai-hint={songImage.imageHint}
        />
        <div className="flex items-center gap-4">
          <div>
            <h3 className="truncate text-sm font-semibold">{activeSong.title}</h3>
            <p className="truncate text-xs text-muted-foreground">
              {activeSong.artist}
            </p>
          </div>
           <Button variant="ghost" size="icon" onClick={handleLike}>
            <Heart
              className={cn('h-5 w-5', currentSongDetails?.likedByUser && 'fill-red-500 text-red-500')}
            />
          </Button>
        </div>
      </div>

      <div className="flex w-1/2 max-w-xl flex-col items-center gap-2">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <Shuffle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={playPrev}>
            <SkipBack className="h-5 w-5" />
          </Button>
          <Button
            variant="default"
            size="icon"
            className="h-10 w-10 rounded-full"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 fill-background" />
            ) : (
              <Play className="h-5 w-5 fill-background" />
            )}
          </Button>
          <Button variant="ghost" size="icon" onClick={playNext}>
            <SkipForward className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <Repeat className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex w-full items-center gap-2">
          <span className="w-10 text-right text-xs text-muted-foreground">
            {formatTime(progress)}
          </span>
          <Slider
            value={[progress]}
            max={duration}
            step={1}
            className="w-full"
            onValueChange={(value) => handleProgressChange(value[0])}
          />
          <span className="w-10 text-xs text-muted-foreground">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      <div className="flex w-1/4 items-center justify-end gap-2">
        <Button variant="ghost" size="icon" onClick={toggleMute}>
          {isMuted || volume === 0 ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </Button>
        <Slider
          value={[isMuted ? 0 : volume]}
          max={1}
          step={0.01}
          className="w-24"
          onValueChange={(value) => handleVolumeChange(value[0])}
        />
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}
