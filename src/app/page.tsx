
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { SoundWaveLogo } from '@/components/icons/soundwave-logo';

export default function Home() {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading) {
            if (user) {
                router.replace('/trending');
            } else {
                router.replace('/login');
            }
        }
    }, [user, loading, router]);

    // Show a loading state while checking auth
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background">
            <SoundWaveLogo className="h-16 w-16 animate-pulse text-primary" />
            <div className="flex flex-col items-center">
                <h1 className="text-2xl font-bold">SoundWave</h1>
                <p className="text-muted-foreground">Loading your music...</p>
            </div>
        </div>
    );
}
