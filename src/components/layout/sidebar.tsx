'use client';

import {
  Home,
  Music,
  User,
  Search,
  Library,
  PlusCircle,
  Heart,
  WandSparkles,
  UploadCloud,
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
import { usePathname } from 'next/navigation';

const menuItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/library', label: 'Your Library', icon: Library },
  { href: '/curator', label: 'AI Curator', icon: WandSparkles },
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

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === href;
    }
    // For profile, we want an exact match
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
          {menuItems.map((item) => (
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
      </SidebarContent>
      <SidebarFooter>
        {/* The profile link is now in the main menu. 
            You can add other footer items here if needed. */}
      </SidebarFooter>
    </>
  );
}
