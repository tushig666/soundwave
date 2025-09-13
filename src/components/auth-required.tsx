
'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

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

  // If there's a user and loading is done, render the children
  if (user && !loading) {
    return <>{children}</>;
  }

  // While loading, or if redirecting, don't render anything (or show a loader)
  // A global loader is already shown in AuthProvider, so we can return null here.
  return null;
}
