
'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';

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
  if (loading) {
     return (
       <div className="p-4 md:p-6 space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-5 w-64" />
         <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
             {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                    <Skeleton className="aspect-square w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            ))}
        </div>
      </div>
    );
  }

  // If there's a user and loading is done, render the children
  if (user) {
    return <>{children}</>;
  }

  // If no user and not loading (i.e., redirecting), return null
  return null;
}
