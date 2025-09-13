
'use client';

import { create } from 'zustand';
import type { Song, User } from './types';
import { mockSongs, mockUsers } from './data';

interface SongState {
  songs: Song[];
  users: User[];
  addSong: (song: Song) => void;
  likeSong: (songId: string) => void;
}

export const useSongStore = create<SongState>()((set) => ({
  songs: mockSongs,
  users: mockUsers,
  addSong: (song) =>
    set((state) => ({
      songs: [...state.songs, song],
    })),
  likeSong: (songId) =>
    set((state) => ({
      songs: state.songs.map((song) =>
        song.id === songId ? { ...song, likes: song.likes + 1 } : song
      ),
    })),
}));
