
'use client';

import { create } from 'zustand';
import type { Song, User } from './types';
import { mockSongs, mockUsers } from './data';

interface SongState {
  songs: Song[];
  users: User[];
  addSong: (song: Song) => void;
  toggleLike: (songId: string) => void;
}

export const useSongStore = create<SongState>()((set) => ({
  songs: mockSongs,
  users: mockUsers,
  addSong: (song) =>
    set((state) => ({
      songs: [...state.songs, song],
    })),
  toggleLike: (songId) =>
    set((state) => ({
      songs: state.songs.map((song) => {
        if (song.id === songId) {
          const isLiked = song.likedByUser;
          return {
            ...song,
            likes: isLiked ? song.likes - 1 : song.likes + 1,
            likedByUser: !isLiked,
          };
        }
        return song;
      }),
    })),
}));
