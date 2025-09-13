'use client';

import type { ReactNode } from 'react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/sidebar';
import { Player } from '@/components/player';
import { PlayerProvider } from '@/hooks/use-player';

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <PlayerProvider>
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
    </PlayerProvider>
  );
}
