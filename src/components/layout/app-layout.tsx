'use client';

import type { ReactNode } from 'react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/sidebar';
import { Player } from '@/components/player';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SoundWaveLogo } from '../icons/soundwave-logo';

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background">
          <SoundWaveLogo className="h-16 w-16 animate-pulse text-primary" />
          <div className="flex flex-col items-center">
              <h1 className="text-2xl font-bold">SoundWave</h1>
              <p className="text-muted-foreground">Loading your music...</p>
          </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="relative flex h-screen w-full flex-col">
        <div className="flex flex-1 overflow-hidden">
          <Sidebar>
            <AppSidebar />
          </Sidebar>
          <SidebarInset className="flex-1 overflow-y-auto !bg-background pb-28">
            {children}
          </SidebarInset>
        </div>
        <Player />
      </div>
    </SidebarProvider>
  );
}
