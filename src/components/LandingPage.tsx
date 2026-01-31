import { ArrowRight } from 'lucide-react'

interface LandingPageProps {
    onJoin: () => void
}

export function LandingPage({ onJoin }: LandingPageProps) {
    return (
        <div className="min-h-screen bg-background text-accent flex flex-col items-center px-6 py-12">
            {/* Hero Section */}
            <header className="w-full max-w-2xl text-center space-y-6 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="inline-block px-3 py-1 bg-accent/10 rounded-full text-xs font-medium tracking-wider uppercase mb-2">
                    Alpha Access (20 Spots)
                </div>
                <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
                    Calm observation, <br />
                    not medical tracking.
                </h1>
                <p className="text-lg md:text-xl opacity-70 leading-relaxed max-w-lg mx-auto">
                    A private, visual timeline for your cat's well-being. Built to help you notice small changes without the noise.
                </p>
                <button
                    onClick={onJoin}
                    className="group inline-flex items-center gap-2 px-8 py-4 bg-accent text-white rounded-2xl font-medium text-lg hover:shadow-xl hover:shadow-accent/10 transition-all active:scale-95"
                >
                    Join the calm alpha
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </header>

            {/* What it does */}
            <section className="w-full max-w-4xl grid md:grid-cols-3 gap-8 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
                <div className="p-8 bg-white/50 rounded-3xl calm-shadow border border-neutral/10 space-y-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                        📸
                    </div>
                    <h3 className="font-semibold text-lg">Photo-First</h3>
                    <p className="text-sm opacity-60 leading-relaxed">
                        Every log starts with a photo. See the visual continuity of their life, one day at a time.
                    </p>
                </div>
                <div className="p-8 bg-white/50 rounded-3xl calm-shadow border border-neutral/10 space-y-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                        ✨
                    </div>
                    <h3 className="font-semibold text-lg">Vibe Swipe</h3>
                    <p className="text-sm opacity-60 leading-relaxed">
                        Log their mood in a single swipe. No complex forms, no medical jargon, just the vibe.
                    </p>
                </div>
                <div className="p-8 bg-white/50 rounded-3xl calm-shadow border border-neutral/10 space-y-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                        🕰️
                    </div>
                    <h3 className="font-semibold text-lg">Simple Timeline</h3>
                    <p className="text-sm opacity-60 leading-relaxed">
                        A newest-first vertical feed. A private album dedicated to the cat you're watching closest.
                    </p>
                </div>
            </section>

            {/* Explicit Guardrails - Repel the wrong users */}
            <footer className="w-full max-w-2xl bg-neutral/5 rounded-3xl p-8 md:p-12 text-center space-y-6 animate-in fade-in duration-1000 delay-300">
                <h2 className="text-sm font-semibold uppercase tracking-widest opacity-40">What this is not</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-left">
                    <div className="space-y-1">
                        <h4 className="font-medium text-accent">No Diagnosis</h4>
                        <p className="text-xs opacity-50">We don't pretend to be a vet. No AI 'insights' or prescriptive advice.</p>
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-medium text-accent">Single Cat Focus</h4>
                        <p className="text-xs opacity-50">Locked to exactly one cat for V1. We don't do multi-cat management.</p>
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-medium text-accent">No Panic Alerts</h4>
                        <p className="text-xs opacity-50">No red notifications, no clinical triggers, and no medical trends.</p>
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-medium text-accent">Zero Analytics</h4>
                        <p className="text-xs opacity-50">No charts, no scatter plots, and no data crunching. Just logging.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
