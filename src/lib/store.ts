
'use client';

import { create } from 'zustand';
import type { Song, Playlist } from './types';
import { db } from './firebase/client';
import { collection, getDocs, doc, updateDoc, increment, query, where, orderBy, getDoc, deleteDoc, writeBatch, addDoc, serverTimestamp } from 'firebase/firestore';

interface SongState {
  songs: Song[];
  playlists: Playlist[];
  fetchSongs: (userId?: string) => Promise<void>;
  toggleLike: (songId: string, userId: string) => Promise<void>;
  getUserSongs: (userId: string) => Song[];
  getLikedSongs: (userId: string) => Promise<Song[]>;
  fetchPlaylists: (userId: string) => Promise<void>;
  createPlaylist: (name: string, ownerId: string) => Promise<void>;
}

const toggleLikeInDb = async (songId: string, userId: string): Promise<boolean> => {
    const songRef = doc(db, 'songs', songId);
    const userLikeRef = doc(db, `users/${userId}/likes`, songId);
    const batch = writeBatch(db);

    try {
        const userLikeDoc = await getDoc(userLikeRef);

        if (userLikeDoc.exists()) {
            batch.update(songRef, { likes: increment(-1) });
            batch.delete(userLikeRef);
            await batch.commit();
            return false;
        } else {
            batch.update(songRef, { likes: increment(1) });
            batch.set(userLikeRef, { songId, likedAt: serverTimestamp() });
            await batch.commit();
            return true;
        }
    } catch (error) {
        console.error("Error toggling like in DB:", error);
        throw error;
    }
};

export const useSongStore = create<SongState>()((set, get) => ({
  songs: [],
  playlists: [],
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
    
    const allSongs = get().songs;
    const likedSongsInStore = allSongs.filter(song => likedSongsIds.has(song.id));
    
    if (likedSongsInStore.length === likedSongsIds.size) {
        return likedSongsInStore.map(song => ({ ...song, likedByUser: true }));
    }

    const songsRef = collection(db, 'songs');
    const likedSongsQuery = query(songsRef, where('__name__', 'in', Array.from(likedSongsIds)));
    const songDocs = await getDocs(likedSongsQuery);
    return songDocs.docs.map(doc => ({ ...doc.data(), id: doc.id, likedByUser: true } as Song));
  },
  fetchPlaylists: async (userId: string) => {
    const playlistsRef = collection(db, 'playlists');
    const q = query(playlistsRef, where('ownerId', '==', userId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const playlists = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Playlist));
    set({ playlists });
  },
  createPlaylist: async (name: string, ownerId: string) => {
    const newPlaylist = {
      name,
      ownerId,
      songIds: [],
      createdAt: serverTimestamp(),
      description: '',
    };
    const playlistsRef = collection(db, 'playlists');
    const docRef = await addDoc(playlistsRef, newPlaylist);
    set(state => ({
      playlists: [{ id: docRef.id, ...newPlaylist } as Playlist, ...state.playlists]
    }));
  },
}));

    