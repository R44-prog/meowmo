import React from 'react';
import { StickyNote } from 'lucide-react';
import { MeowmoLogo } from '@/components/ui/MeowmoLogo';

interface LandingPageProps {
    onJoin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onJoin }) => {
    return (
        <main className="min-h-screen bg-[#faf9f7] text-[#4a4a4a] flex flex-col items-center p-6 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div aria-hidden="true" className="absolute top-0 right-0 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -mr-16 -mt-16 animate-blob"></div>
            <div aria-hidden="true" className="absolute bottom-0 left-0 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -ml-16 -mb-16 animate-blob animation-delay-2000"></div>

            {/* Content Container */}
            <div className="w-full max-w-sm flex-1 flex flex-col justify-center items-center z-10 space-y-12">

                {/* Header / Logo */}
                <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <MeowmoLogo size={120} showText={true} />
                    <p className="text-lg text-neutral/60 font-medium">Your cat's daily memo.</p>
                </div>

                {/* CTA */}
                <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                    <button
                        onClick={onJoin}
                        className="w-full py-4 bg-accent text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                    >
                        <StickyNote className="w-5 h-5 group-hover:text-yellow-200 transition-colors" />
                        <span>Start Memo</span>
                    </button>
                    <p className="text-xs text-center text-neutral/40">Private • Local First • Funny</p>
                </div>
            </div>
        </main>
    );
};
