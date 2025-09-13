'use client';

import type { Song } from '@/lib/types';
import type { ReactNode } from 'react';
import { createContext, useContext, useState, useRef, useEffect } from 'react';

type PlayerContextType = {
  activeSong?: Song;
  playlist: Song[];
  isPlaying: boolean;
  play: (song: Song, playlist?: Song[]) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrev: () => void;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [activeSong, setActiveSong] = useState<Song | undefined>(undefined);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
    }
  }, []);

  useEffect(() => {
    if (audioRef.current && activeSong) {
      if (audioRef.current.src !== activeSong.audioUrl) {
        audioRef.current.src = activeSong.audioUrl;
      }
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [activeSong, isPlaying]);

  const play = (song: Song, newPlaylist: Song[] = []) => {
    setActiveSong(song);
    if (newPlaylist.length > 0) {
      setPlaylist(newPlaylist);
    } else if (playlist.length === 0 || !playlist.find(s => s.id === song.id)) {
      setPlaylist([song]);
    }
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (activeSong) {
      setIsPlaying(!isPlaying);
    }
  };

  const playNext = () => {
    if (!activeSong || playlist.length === 0) return;
    const currentIndex = playlist.findIndex((s) => s.id === activeSong.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    setActiveSong(playlist[nextIndex]);
    setIsPlaying(true);
  };

  const playPrev = () => {
    if (!activeSong || playlist.length === 0) return;
    const currentIndex = playlist.findIndex((s) => s.id === activeSong.id);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    setActiveSong(playlist[prevIndex]);
    setIsPlaying(true);
  };

  return (
    <PlayerContext.Provider
      value={{
        activeSong,
        playlist,
        isPlaying,
        play,
        togglePlay,
        playNext,
        playPrev,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
