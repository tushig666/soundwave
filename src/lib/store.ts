
'use client';

import { create } from 'zustand';
import type { Song, Playlist } from './types';
import { db } from './firebase/client';
import { collection, getDocs, doc, updateDoc, increment, query, where, orderBy, getDoc, deleteDoc, writeBatch, addDoc, serverTimestamp, arrayUnion, arrayRemove } from 'firebase/firestore';

interface SongState {
  songs: Song[];
  playlists: Playlist[];
  fetchSongs: (userId?: string) => Promise<void>;
  toggleLike: (songId: string, userId: string) => Promise<void>;
  getUserSongs: (userId: string) => Song[];
  getLikedSongs: (userId: string) => Promise<Song[]>;
  fetchPlaylists: (userId: string) => Promise<void>;
  createPlaylist: (name: string, ownerId: string) => Promise<void>;
  getPlaylistById: (playlistId: string) => Promise<Playlist | null>;
  addSongToPlaylist: (playlistId: string, songId: string) => Promise<void>;
  removeSongFromPlaylist: (playlistId: string, songId: string) => Promise<void>;
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
    
    // Use the fetched songs from the store to avoid redundant reads
    const allSongs = get().songs.length > 0 ? get().songs : (await get().fetchSongs(userId), get().songs);
    const likedSongs = allSongs
        .filter(song => likedSongsIds.has(song.id))
        .map(song => ({ ...song, likedByUser: true }));

    // Sort based on the likedAt timestamp implicitly by the order of IDs from the query
    const sortedLikedSongs = Array.from(likedSongsIds).map(id => likedSongs.find(song => song.id === id)).filter(s => s) as Song[];
    return sortedLikedSongs;
  },
  fetchPlaylists: async (userId: string) => {
    const playlistsRef = collection(db, 'playlists');
    const q = query(playlistsRef, where('ownerId', '==', userId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const playlists = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Playlist));
    set({ playlists });
  },
  createPlaylist: async (name: string, ownerId: string) => {
    const newPlaylistData = {
      name,
      ownerId,
      songIds: [],
      createdAt: serverTimestamp(),
      description: '',
    };
    const playlistsRef = collection(db, 'playlists');
    const docRef = await addDoc(playlistsRef, newPlaylistData);
    const newPlaylist = { id: docRef.id, ...newPlaylistData } as Playlist;
    set(state => ({
      playlists: [newPlaylist, ...state.playlists]
    }));
  },
  getPlaylistById: async (playlistId: string): Promise<Playlist | null> => {
    const playlistRef = doc(db, 'playlists', playlistId);
    const playlistSnap = await getDoc(playlistRef);

    if (!playlistSnap.exists()) {
      return null;
    }

    const playlistData = { id: playlistSnap.id, ...playlistSnap.data() } as Playlist;

    if (playlistData.songIds && playlistData.songIds.length > 0) {
      // Fetch all songs if not already in store
      const allSongs = get().songs.length > 0 ? get().songs : (await get().fetchSongs(), get().songs);
      const songDetails = playlistData.songIds.map(songId => allSongs.find(s => s.id === songId)).filter(Boolean) as Song[];
      playlistData.songs = songDetails;
    } else {
        playlistData.songs = [];
    }

    return playlistData;
  },
  addSongToPlaylist: async (playlistId: string, songId: string) => {
    const playlistRef = doc(db, 'playlists', playlistId);
    await updateDoc(playlistRef, {
        songIds: arrayUnion(songId)
    });
    // Optionally, you can update the local state as well for immediate UI feedback
    set(state => ({
        playlists: state.playlists.map(p => p.id === playlistId ? { ...p, songIds: [...p.songIds, songId] } : p)
    }));
  },
  removeSongFromPlaylist: async (playlistId: string, songId: string) => {
    const playlistRef = doc(db, 'playlists', playlistId);
    await updateDoc(playlistRef, {
        songIds: arrayRemove(songId)
    });
     set(state => ({
        playlists: state.playlists.map(p => p.id === playlistId ? { ...p, songIds: p.songIds.filter(id => id !== songId) } : p)
    }));
  }
}));
    