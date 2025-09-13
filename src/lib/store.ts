
'use client';

import { create } from 'zustand';
import type { Song } from './types';
import { db } from './firebase/client';
import { collection, getDocs, doc, updateDoc, increment, query, where, orderBy, getDoc, deleteDoc, writeBatch } from 'firebase/firestore';

interface SongState {
  songs: Song[];
  fetchSongs: (userId?: string) => Promise<void>;
  toggleLike: (songId: string, userId: string) => Promise<void>;
  getUserSongs: (userId: string) => Song[];
  getLikedSongs: (userId: string) => Promise<Song[]>;
}

const toggleLikeInDb = async (songId: string, userId: string): Promise<boolean> => {
    const songRef = doc(db, 'songs', songId);
    const userLikeRef = doc(db, `users/${userId}/likes`, songId);

    const batch = writeBatch(db);

    try {
        const userLikeDoc = await getDoc(userLikeRef);

        if (userLikeDoc.exists()) {
            // User has liked the song, so unlike it
            batch.update(songRef, { likes: increment(-1) });
            batch.delete(userLikeRef);
            await batch.commit();
            return false; // Liked status is now false
        } else {
            // User has not liked the song, so like it
            batch.update(songRef, { likes: increment(1) });
            batch.set(userLikeRef, { songId, likedAt: new Date() });
            await batch.commit();
            return true; // Liked status is now true
        }
    } catch (error) {
        console.error("Error toggling like in DB:", error);
        throw error;
    }
};


export const useSongStore = create<SongState>()((set, get) => ({
  songs: [],
  fetchSongs: async (userId) => {
    const songsCollection = collection(db, 'songs');
    const q = query(songsCollection, orderBy('createdAt', 'desc'));
    const songSnapshot = await getDocs(q);
    let songList = songSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Song));

    if (userId) {
        const userLikesRef = collection(db, `users/${userId}/likes`);
        const userLikesSnapshot = await getDocs(userLikesRef);
        const likedSongIds = new Set(userLikesSnapshot.docs.map(doc => doc.id));
        songList = songList.map(song => ({
            ...song,
            likedByUser: likedSongIds.has(song.id)
        }));
    }

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
                      likedByUser: isNowLiked
                  };
              }
              return song;
          })
      }));
  },
  getUserSongs: (userId: string) => {
      return get().songs.filter(song => song.artistId === userId);
  },
  getLikedSongs: async (userId: string): Promise<Song[]> => {
    const likedSongsIds = new Set<string>();
    const userLikesRef = collection(db, `users/${userId}/likes`);
    const q = query(userLikesRef, orderBy('likedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      likedSongsIds.add(doc.id);
    });

    if (likedSongsIds.size === 0) {
      return [];
    }
    
    // We can't use a single `in` query if there are more than 30 liked songs.
    // This is a simplified approach. For a production app, you might fetch songs in batches.
    const allSongs = get().songs;
    const likedSongs = allSongs.filter(song => likedSongsIds.has(song.id));
    
    // Add likedByUser since we know these are all liked.
    return likedSongs.map(song => ({ ...song, likedByUser: true }));
  },
}));

// Initial fetch can be triggered in a layout or provider component
// useSongStore.getState().fetchSongs();

