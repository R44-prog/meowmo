import React from 'react';
import { cn } from '@/lib/utils';

interface MeowmoLogoProps {
    className?: string;
    size?: number;
    showText?: boolean;
}

export const MeowmoLogo: React.FC<MeowmoLogoProps> = ({
    className,
    size = 48,
    showText = false
}) => {
    return (
        <div className={cn("flex flex-col items-center gap-2", className)}>
            {/* Geometric Cat Face 'M' */}
            <div
                className="relative bg-gradient-to-br from-orange-400 to-amber-500 rounded-3xl flex items-center justify-center shadow-lg transform transition-transform hover:scale-105"
                style={{ width: size, height: size }} // Dynamic sizing requires inline style
            >
                {/* Ears / M Shape */}
                <svg
                    width={size * 0.6}
                    height={size * 0.6}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-white drop-shadow-sm"
                >
                    <path
                        d="M3 8L8 3L12 7L16 3L21 8V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V8Z"
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {/* Eyes */}
                    <circle cx="8.5" cy="14.5" r="1.5" fill="#F59E0B" />
                    <circle cx="15.5" cy="14.5" r="1.5" fill="#F59E0B" />
                    {/* Nose */}
                    <path d="M11 18L12 19L13 18" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
                </svg>

                {/* Shine Effect */}
                <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-orange-200/20 rounded-full blur-md -mr-1 -mt-1" />
            </div>

            {showText && (
                <div className="text-center">
                    <h1 className="text-xl font-black tracking-tight text-accent">Meowmo</h1>
                </div>
            )}
        </div>
    );
};
