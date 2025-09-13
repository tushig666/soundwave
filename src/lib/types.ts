
import type { Timestamp } from 'firebase/firestore';

export type Song = {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  coverUrl: string;
  audioUrl: string;
  genre: string;
  description: string;
  likes: number;
  isPublic: boolean;
  likedByUser?: boolean;
  createdAt: Timestamp;
};

export type User = {
  id: string;
  name: string;
  artistId: string;
  bio: string;
  profilePictureUrl: string;
};

export type Playlist = {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  songIds: string[];
};
