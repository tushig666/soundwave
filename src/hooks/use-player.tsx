
'use client';

import type { Song } from '@/lib/types';
import type { ReactNode } from 'react';
import { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

type PlayerContextType = {
  activeSong?: Song;
  playlist: Song[];
  isPlaying: boolean;
  play: (song: Song, playlist?: Song[]) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrev: () => void;
  progress: number;
  duration: number;
  handleProgressChange: (value: number) => void;
  volume: number;
  isMuted: boolean;
  handleVolumeChange: (value: number) => void;
  toggleMute: () => void;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [activeSong, setActiveSong] = useState<Song | undefined>(undefined);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Audio element on client side to avoid SSR issues
  useEffect(() => {
    audioRef.current = new Audio();
    const audioElement = audioRef.current;

    const handleTimeUpdate = () => setProgress(audioElement.currentTime);
    const handleLoadedMetadata = () => setDuration(audioElement.duration);
    const handleEnded = () => playNext();

    audioElement.addEventListener('timeupdate', handleTimeUpdate);
    audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioElement.addEventListener('ended', handleEnded);

    return () => {
      audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioElement.removeEventListener('ended', handleEnded);
    };
  }, []); // We add playNext to dependency array later

  // Effect to handle song loading and playback
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    if (activeSong) {
      if (audioElement.src !== activeSong.audioUrl) {
        audioElement.src = activeSong.audioUrl;
      }
      if (isPlaying) {
        audioElement.play().catch((e) => console.error("Audio playback failed:", e));
      } else {
        audioElement.pause();
      }
    } else {
      audioElement.pause();
    }
  }, [activeSong, isPlaying]);
  
  // Effect to control volume
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    audioElement.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const play = (song: Song, newPlaylist: Song[] = []) => {
     if (activeSong?.id === song.id) {
      togglePlay();
      return;
    }
    setActiveSong(song);
    setIsPlaying(true);
    
    if (newPlaylist.length > 0) {
      // If a new playlist is provided, set it.
      setPlaylist(newPlaylist);
    } else if (!playlist.some(s => s.id === song.id)) {
      // If no playlist is provided and the song is not in the current one, create a new playlist.
      setPlaylist([song]);
    }
    // Otherwise, keep the current playlist.
  };

  const togglePlay = () => {
    if (activeSong) {
      setIsPlaying(!isPlaying);
    }
  };

  const playNext = useCallback(() => {
    if (!activeSong || playlist.length === 0) return;
    const currentIndex = playlist.findIndex((s) => s.id === activeSong.id);
    if (currentIndex === -1) {
        // If the active song is not in the playlist, play the first song.
        setActiveSong(playlist[0]);
    } else {
        const nextIndex = (currentIndex + 1) % playlist.length;
        setActiveSong(playlist[nextIndex]);
    }
    setIsPlaying(true);
  }, [activeSong, playlist]);


  const playPrev = () => {
    if (!activeSong || playlist.length === 0) return;
    const currentIndex = playlist.findIndex((s) => s.id === activeSong.id);
     if (currentIndex === -1) {
        setActiveSong(playlist[0]);
     } else {
        const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
        setActiveSong(playlist[prevIndex]);
     }
    setIsPlaying(true);
  };
  
  const handleProgressChange = (value: number) => {
    const audioElement = audioRef.current;
    if (!audioElement) return;
    audioElement.currentTime = value;
    setProgress(value);
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value);
    if (isMuted && value > 0) {
      setIsMuted(false);
    }
  };
  
  const toggleMute = () => {
      setIsMuted(!isMuted);
  };
  
  // Add playNext to dependencies after it's defined
  useEffect(() => {
      const audioElement = audioRef.current;
      if (!audioElement) return;
      const handleEnded = () => playNext();
      audioElement.addEventListener('ended', handleEnded);
      return () => {
          audioElement.removeEventListener('ended', handleEnded);
      }
  }, [playNext]);

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
        progress,
        duration,
        handleProgressChange,
        volume,
        isMuted,
        handleVolumeChange,
        toggleMute,
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
