import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Trophy, Share2, Sparkles, Heart, Info, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export const AchievementPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    // Mock data for the demonstration
    // In production, this would fetch from Supabase/Dexie based on the short-ID
    const trophy = {
        catName: localStorage.getItem('catName') || "Your Cat",
        description: "As a floating island in a sea of clouds, maintaining perfect balance.",
        imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1000&auto=format&fit=crop",
        clinicalFootnote: "A perfect loaf is a signs of a relaxed and secure cat. It shows they feel safe enough to hide their 'getaway' limbs.",
        behavior: "The Perfect Loaf",
        earnedAt: new Date().toLocaleDateString()
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `${trophy.catName}'s Surreal Milestone`,
                text: `Look at this amazing health milestone Luna achieved on Meowmo!`,
                url: window.location.href,
            });
        }
    };

    return (
        <div className="min-h-screen bg-midnight pb-20">
            {/* Header / Navigation */}
            <div className="p-6 flex items-center justify-between max-w-lg mx-auto">
                <Link to="/" className="sw-10 h-10 glass shadow-2xl rounded-xl flex items-center justify-center text-accent/30 hover:text-amber transition-all border border-white/5">
                    <ChevronLeft size={20} />
                </Link>
                <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-amber fill-amber" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent/30">Meowmo Achievement</span>
                </div>
                <div className="w-10" /> {/* Spacer */}
            </div>

            <main className="max-w-md mx-auto px-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                {/* The Hero Trophy Card */}
                <div className="relative group">
                    <div className="absolute -inset-4 bg-gradient-to-br from-amber/20 via-surface/30 to-amber/20 blur-3xl opacity-50 transition-opacity group-hover:opacity-70" />
                    <div className="relative shadow-2xl glass rounded-[2rem] overflow-hidden border border-white/5">
                        <div className="aspect-square relative overflow-hidden group/img">
                            <img
                                src={trophy.imageUrl}
                                alt="Surreal Trophy"
                                className="w-full h-full object-cover scale-105 group-hover/img:scale-110 transition-transform duration-[2000ms]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <Trophy size={16} className="text-amber fill-amber" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Surreal Achievement Unlocked</span>
                                </div>
                                <h1 className="text-2xl font-bold text-white leading-tight drop-shadow-md">{trophy.behavior}</h1>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="space-y-2">
                                <p className="text-lg font-black text-accent leading-snug tracking-tighter uppercase">
                                    {trophy.description}
                                </p>
                                <div className="flex items-center gap-2 text-[10px] font-black text-accent/20 uppercase tracking-[0.2em]">
                                    <Heart size={12} className="text-red-400 fill-red-400" />
                                    <span>Earned by {trophy.catName} on {trophy.earnedAt}</span>
                                </div>
                            </div>

                            {/* Dr. Quinn's Segment */}
                            <div className="p-4 bg-amber/5 rounded-2xl border border-amber/10 space-y-3 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-3 opacity-5">
                                    <Info size={40} className="text-amber" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-amber/10 flex items-center justify-center text-amber text-[8px] font-black border border-amber/20">Q</div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-amber">Clinical Insight</span>
                                </div>
                                <p className="text-xs text-accent/70 italic leading-relaxed relative z-10 font-medium">
                                    "{trophy.clinicalFootnote}"
                                </p>
                            </div>

                            {/* Viral Hook */}
                            <div className="pt-2 text-center space-y-4">
                                <p className="text-[10px] text-accent/30 leading-relaxed font-bold uppercase tracking-tight">
                                    Meowmo helps you bond with your cat through surreal art and quiet observation.
                                </p>
                                <button
                                    onClick={handleShare}
                                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-amber text-white rounded-2xl font-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-amber/20 uppercase tracking-widest text-sm"
                                >
                                    <Share2 size={20} />
                                    Share Achievement
                                </button>
                                <Link to="/" className="inline-block text-[11px] font-black text-amber/60 uppercase tracking-widest hover:text-amber transition-colors">
                                    Back to Memories
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Disclaimer (Ethical Growth) */}
                <div className="text-center px-4">
                    <p className="text-[9px] text-accent/20 leading-relaxed uppercase tracking-[0.3em] font-black">
                        Not Medical Advice • Record for calm, consult for care
                    </p>
                </div>
            </main>
        </div>
    );
};
