import * as React from 'react';
import { cn } from '@/lib/utils';

export const SoundWaveLogo = ({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('h-6 w-6', className)}
    {...props}
  >
    <path d="M2 10.5v3" />
    <path d="M6 8.5v7" />
    <path d="M10 6.5v11" />
    <path d="M14 4.5v15" />
    <path d="M18 9.5v5" />
    <path d="M22 11.5v1" />
  </svg>
);
