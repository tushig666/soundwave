
'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { SoundWaveLogo } from './icons/soundwave-logo';

interface AuthRequiredProps {
  children: ReactNode;
}

export function AuthRequired({ children }: AuthRequiredProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If loading is finished and there's no user, redirect to login
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  // While loading, show a skeleton loader
  if (loading || !user) {
     return (
       <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background">
          <SoundWaveLogo className="h-16 w-16 animate-pulse text-primary" />
          <div className="flex flex-col items-center">
              <h1 className="text-2xl font-bold">SoundWave</h1>
              <p className="text-muted-foreground">Securing your session...</p>
          </div>
      </div>
    );
  }

  // If there's a user and loading is done, render the children
  return <>{children}</>;
}
