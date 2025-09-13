
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
  TrendingUp,
  LogIn,
  LogOut,
  UserPlus,
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

const guestMenuItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/trending', label: 'Trending', icon: TrendingUp },
  { href: '/search', label: 'Search', icon: Search },
];

const authenticatedMenuItems = [
  { href: '/library', label: 'Your Library', icon: Library },
  { href: '/upload', label: 'Upload', icon: UploadCloud },
  { href: '/profile/me', label: 'My Profile', icon: User },
];

const playlists = [
  { href: '/playlist/liked', label: 'Liked Songs', icon: Heart },
  { href: '/playlist/1', label: 'Chill Mix', icon: Music },
  { href: '/playlist/2', label: 'Focus Flow', icon: Music },
  { href: '/playlist/3', label: 'Workout', icon: Music },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    await auth.signOut();
    toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
    router.push('/login');
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === href;
    }
    if (href === '/profile/me') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2">
          <Music className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">SoundWave</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {guestMenuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href} legacyBehavior passHref>
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
          {user &&
            authenticatedMenuItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <Link href={item.href} legacyBehavior passHref>
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
            <SidebarGroupLabel className="flex items-center justify-between">
              <span>Playlists</span>
              <PlusCircle className="h-4 w-4 cursor-pointer hover:text-primary" />
            </SidebarGroupLabel>
            <SidebarMenu>
              {playlists.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <Link href={item.href} legacyBehavior passHref>
                    <SidebarMenuButton
                      size="sm"
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
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {!user ? (
            <>
              <SidebarMenuItem>
                <Link href="/signup" legacyBehavior passHref>
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
                <Link href="/login" legacyBehavior passHref>
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
