
'use client';

import { create } from 'zustand';
import type { Song } from './types';
import { db } from './firebase/client';
import { collection, getDocs, doc, updateDoc, increment, query, where, orderBy, getDoc } from 'firebase/firestore';

interface SongState {
  songs: Song[];
  fetchSongs: () => Promise<void>;
  toggleLike: (songId: string, userId: string) => Promise<void>;
  getUserSongs: (userId: string) => Song[];
}

const toggleLikeInDb = async (songId: string, userId: string) => {
    const songRef = doc(db, 'songs', songId);
    const userLikeRef = doc(db, `users/${userId}/likes`, songId);
    const songDoc = await getDoc(songRef);
    const userLikeDoc = await getDoc(userLikeRef);

    if (!songDoc.exists()) {
        throw new Error("Song not found");
    }

    if (userLikeDoc.exists()) {
        // User has liked the song, so unlike it
        await updateDoc(songRef, { likes: increment(-1) });
        await db.runTransaction(async (transaction) => {
            transaction.delete(userLikeRef);
        });
        return false; // Liked status is now false
    } else {
        // User has not liked the song, so like it
        await updateDoc(songRef, { likes: increment(1) });
         await db.runTransaction(async (transaction) => {
            transaction.set(userLikeRef, { songId });
        });
        return true; // Liked status is now true
    }
}


export const useSongStore = create<SongState>()((set, get) => ({
  songs: [],
  fetchSongs: async () => {
    const songsCollection = collection(db, 'songs');
    const q = query(songsCollection, orderBy('createdAt', 'desc'));
    const songSnapshot = await getDocs(q);
    const songList = songSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Song));
    set({ songs: songList });
  },
  toggleLike: async (songId: string, userId: string) => {
      const isNowLiked = await toggleLikeInDb(songId, userId);
      set(state => ({
          songs: state.songs.map(song => {
              if (song.id === songId) {
                  return {
                      ...song,
                      likes: song.likes + (isNowLiked ? 1 : -1),
                      // This client-side status is an optimistic update
                      likedByUser: isNowLiked 
                  };
              }
              return song;
          })
      }));
  },
  getUserSongs: (userId: string) => {
      return get().songs.filter(song => song.artistId === userId);
  }
}));

// Fetch songs when the app loads
useSongStore.getState().fetchSongs();
