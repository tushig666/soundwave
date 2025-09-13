
'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useSongStore } from '@/lib/store';
import { SongCard } from '@/components/song-card';
import { Button } from '@/components/ui/button';
import { User, Edit, Music, LogOut } from 'lucide-react';
import { AuthRequired } from '@/components/auth-required';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase/client';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const { songs, fetchSongs } = useSongStore();
  const router = useRouter();
  const { toast } = useToast();
  
  useEffect(() => {
    if (user?.uid) {
      fetchSongs(user.uid);
    } else {
      fetchSongs();
    }
  }, [fetchSongs, user?.uid]);
  
  const handleLogout = async () => {
    await auth.signOut();
    toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
    router.push('/login');
  };

  if (authLoading || !user) {
    return (
       <div className="p-4 md:p-6">
        <header className="mb-8 flex flex-col items-center gap-6 md:flex-row">
            <Skeleton className="relative h-32 w-32 shrink-0 rounded-full md:h-40 md:w-40" />
            <div className="flex flex-col items-center gap-2 text-center md:items-start md:text-left">
               <Skeleton className="h-10 w-48" />
               <Skeleton className="h-5 w-64" />
               <Skeleton className="h-5 w-72" />
               <Skeleton className="mt-2 h-9 w-32" />
            </div>
        </header>
         <section>
            <h2 className="mb-4 text-2xl font-semibold">My Uploads</h2>
             <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                 {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="aspect-square w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                ))}
            </div>
        </section>
      </div>
    )
  }
  
  const userSongs = songs.filter(
    (song) => song.artistId === user.uid
  );
  
  const displayName = user.displayName || 'User';
  const profilePic = user.photoURL;


  return (
    <AuthRequired>
        <div className="p-4 md:p-6">
        <header className="relative mb-8 flex flex-col items-center gap-6 md:flex-row">
            <div className="relative h-32 w-32 shrink-0 md:h-40 md:w-40">
            {profilePic ? (
                <Image
                    src={profilePic}
                    alt={`${displayName}'s profile picture`}
                    fill
                    className="rounded-full object-cover shadow-lg"
                    data-ai-hint="user profile"
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-muted shadow-lg">
                    <User className="h-16 w-16 text-muted-foreground" />
                </div>
            )}
            </div>
            <div className="flex flex-col items-center gap-2 text-center md:items-start md:text-left">
            <div className="flex items-center gap-2">
                <User className="h-6 w-6 text-primary" />
                <h1 className="text-4xl font-bold">{displayName}</h1>
            </div>
             <p className="max-w-md text-muted-foreground">{user.email}</p>
             <p className="max-w-md text-muted-foreground">Welcome to your profile. View your uploaded songs below.</p>
            <div className="mt-2">
              <Link href="/profile/edit">
                  <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                  </Button>
              </Link>
            </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="absolute top-0 right-0 h-8 w-8">
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Logout</span>
            </Button>
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
                <Music className="h-12 w-12" />
                <p className="mt-4">You haven't uploaded any songs yet.</p>
                 <Link href="/upload" passHref>
                    <Button variant="primary" size="sm" className="mt-4">Upload your first song</Button>
                </Link>
            </div>
            )}
        </section>
        </div>
    </AuthRequired>
  );
}
