
'use client';

import { SoundWaveLogo } from '@/components/icons/soundwave-logo';

interface UploadProgressIndicatorProps {
  progress: number;
}

export function UploadProgressIndicator({ progress }: UploadProgressIndicatorProps) {
  const fillHeight = `${progress}%`;

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative h-24 w-24">
        {/* Background icon (outline) */}
        <SoundWaveLogo className="absolute inset-0 h-full w-full text-muted-foreground/30" />

        {/* Foreground icon (filled, clipped) */}
        <div
          className="absolute bottom-0 left-0 h-full w-full overflow-hidden"
          style={{ height: fillHeight }}
        >
          <SoundWaveLogo className="absolute bottom-0 h-24 w-24 text-primary" />
        </div>
      </div>
      <p className="text-lg font-semibold text-primary">{Math.round(progress)}%</p>
      <p className="text-sm text-muted-foreground">Uploading your track...</p>
    </div>
  );
}
