
'use client';

import {
  Home,
  Music,
  User,
  Search,
  Library,
  PlusCircle,
  Heart,
  UploadCloud,
  Flame,
  LogIn,
  LogOut,
  UserPlus,
  Loader2,
} from 'lucide-react';
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { auth } from '@/lib/firebase/client';
import { useToast } from '@/hooks/use-toast';
import { useSongStore } from '@/lib/store';
import React, { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SoundWaveLogo } from '../icons/soundwave-logo';


const authenticatedMenuItems = [
  { href: '/library', label: 'Your Library', icon: Library },
  { href: '/upload', label: 'Upload', icon: UploadCloud },
  { href: '/profile/me', label: 'My Profile', icon: User },
];


export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const { playlists, fetchPlaylists, createPlaylist } = useSongStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      fetchPlaylists(user.uid);
    }
  }, [user?.uid, fetchPlaylists]);


  const handleLogout = async () => {
    await auth.signOut();
    toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
    router.push('/login');
  };

  const handleCreatePlaylist = async () => {
    if (!user || !newPlaylistName.trim()) {
      toast({ title: 'Error', description: 'Playlist name cannot be empty.', variant: 'destructive' });
      return;
    }
    setIsCreating(true);
    try {
      await createPlaylist(newPlaylistName, user.uid);
      toast({ title: 'Success!', description: `Playlist "${newPlaylistName}" created.` });
      setNewPlaylistName('');
      setIsAlertOpen(false);
    } catch (error: any) {
      toast({ title: 'Failed to create playlist', description: error.message, variant: 'destructive' });
    } finally {
      setIsCreating(false);
    }
  }

  const isActive = (href: string) => {
    if (href === '/') {
        return pathname === href;
    }
    return pathname.startsWith(href);
  };
  
  const isHomeActive = pathname === '/';

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2">
          <SoundWaveLogo className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">SoundWave</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
           <SidebarMenuItem>
              <Link href="/trending">
                <SidebarMenuButton
                  isActive={pathname.startsWith('/trending') || isHomeActive}
                  tooltip="Trending"
                >
                  <Flame />
                  <span>Trending</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/search">
                <SidebarMenuButton
                  isActive={pathname.startsWith('/search')}
                  tooltip="Search"
                >
                  <Search />
                  <span>Search</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>

          {user &&
            authenticatedMenuItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    isActive={isActive(item.href)}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
        </SidebarMenu>

        {user && (
          <SidebarGroup>
             <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
              <AlertDialogTrigger asChild>
                <SidebarGroupLabel className="flex items-center justify-between">
                  <span>Playlists</span>
                  <PlusCircle className="h-4 w-4 cursor-pointer hover:text-primary" />
                </SidebarGroupLabel>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Create New Playlist</AlertDialogTitle>
                  <AlertDialogDescription>
                    Give your new playlist a name.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="playlist-name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="playlist-name"
                      value={newPlaylistName}
                      onChange={(e) => setNewPlaylistName(e.target.value)}
                      className="col-span-3"
                      placeholder="My Awesome Mix"
                    />
                  </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button onClick={handleCreatePlaylist} disabled={isCreating}>
                    {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <SidebarMenu>
              <SidebarMenuItem>
                  <Link href="/playlist/liked">
                    <SidebarMenuButton
                      size="sm"
                      isActive={isActive('/playlist/liked')}
                      tooltip="Liked Songs"
                    >
                      <Heart />
                      <span>Liked Songs</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              {playlists.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <Link href={`/playlist/${item.id}`}>
                    <SidebarMenuButton
                      size="sm"
                      isActive={isActive(`/playlist/${item.id}`)}
                      tooltip={item.name}
                    >
                      <Music />
                      <span>{item.name}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {!user ? (
            <>
              <SidebarMenuItem>
                <Link href="/signup">
                  <SidebarMenuButton
                    isActive={pathname === '/signup'}
                    tooltip="Sign Up"
                  >
                    <UserPlus />
                    <span>Sign Up</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/login">
                  <SidebarMenuButton
                    isActive={pathname === '/login'}
                    tooltip="Login"
                  >
                    <LogIn />
                    <span>Login</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </>
          ) : (
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
                <LogOut />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}

    
