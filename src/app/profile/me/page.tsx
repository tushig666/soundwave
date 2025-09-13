
'use client';

import Image from 'next/image';
import { useSongStore } from '@/lib/store';
import { SongCard } from '@/components/song-card';
import { Button } from '@/components/ui/button';
import { User, Edit } from 'lucide-react';

export default function ProfilePage() {
  const { users, songs } = useSongStore();
  // For this demo, we'll just grab the first user as the "logged in" user.
  const currentUser = users.find((u) => u.artistId === 'a4');

  // Find songs uploaded by the current user
  const userSongs = songs.filter(
    (song) => song.artistId === currentUser?.artistId
  );

  if (!currentUser) {
    return (
      <div className="flex h-full items-center justify-center p-4 md:p-6">
        <p>User not found.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <header className="mb-8 flex flex-col items-center gap-6 md:flex-row">
        <div className="relative h-32 w-32 shrink-0 md:h-40 md:w-40">
          <Image
            src={currentUser.profilePictureUrl}
            alt={`${currentUser.name}'s profile picture`}
            fill
            className="rounded-full object-cover shadow-lg"
            data-ai-hint="user profile"
          />
        </div>
        <div className="flex flex-col items-center gap-2 text-center md:items-start md:text-left">
          <div className="flex items-center gap-2">
            <User className="h-6 w-6 text-primary" />
            <h1 className="text-4xl font-bold">{currentUser.name}</h1>
          </div>
          <p className="max-w-md text-muted-foreground">{currentUser.bio}</p>
          <Button variant="outline" size="sm" className="mt-2">
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </header>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">My Uploads</h2>
        {userSongs.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {userSongs.map((song) => (
              <SongCard key={song.id} song={song} playlist={userSongs} />
            ))}
          </div>
        ) : (
          <div className="flex h-48 flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8 text-center text-muted-foreground">
            <p>You haven't uploaded any songs yet.</p>
          </div>
        )}
      </section>
    </div>
  );
}
