import React from 'react';

export const TimelineSkeleton: React.FC = () => {
    return (
        <div className="space-y-4 p-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-neutral/10 shadow-sm animate-pulse">
                    <div className="flex justify-between items-start mb-3">
                        {/* Vibe Badge Skeleton */}
                        <div className="h-6 w-16 bg-neutral/10 rounded-full" />

                        {/* Date Skeleton */}
                        <div className="h-4 w-24 bg-neutral/10 rounded" />
                    </div>

                    {/* Note Lines */}
                    <div className="space-y-2 mb-4">
                        <div className="h-4 w-3/4 bg-neutral/10 rounded" />
                        <div className="h-4 w-1/2 bg-neutral/10 rounded" />
                    </div>

                    {/* Tags */}
                    <div className="flex gap-2 justify-end">
                        <div className="h-5 w-8 bg-neutral/10 rounded" />
                        <div className="h-5 w-8 bg-neutral/10 rounded" />
                    </div>
                </div>
            ))}
        </div>
    );
};
