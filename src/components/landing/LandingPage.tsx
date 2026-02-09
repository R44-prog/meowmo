import React from 'react';
import { StickyNote } from 'lucide-react';
import { MeowmoLogo } from '@/components/ui/MeowmoLogo';

interface LandingPageProps {
    onJoin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onJoin }) => {
    return (
        <main className="min-h-screen bg-midnight text-accent flex flex-col items-center p-6 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div aria-hidden="true" className="absolute top-0 right-0 w-64 h-64 bg-amber-light rounded-full mix-blend-screen filter blur-3xl opacity-10 -mr-16 -mt-16 animate-blob"></div>
            <div aria-hidden="true" className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 -ml-16 -mb-16 animate-blob animation-delay-2000"></div>

            {/* Content Container */}
            <div className="w-full max-w-sm flex-1 flex flex-col justify-center items-center z-10 space-y-12">

                <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <MeowmoLogo size={120} showText={true} />
                    <p className="text-lg text-accent/60 font-medium">Your cat's daily memo.</p>
                </div>

                <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                    <button
                        onClick={onJoin}
                        className="w-full py-4 bg-amber text-white rounded-2xl font-bold text-lg shadow-xl shadow-amber/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                    >
                        <StickyNote className="w-5 h-5 group-hover:text-yellow-200 transition-colors" />
                        <span>Start Memo</span>
                    </button>
                    <p className="text-xs text-center text-accent/40">Private • Local First • Funny</p>
                </div>
            </div>
        </main>
    );
};
