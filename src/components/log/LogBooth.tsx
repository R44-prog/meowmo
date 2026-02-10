import React, { useState, useRef, useEffect } from 'react';
import { Camera, Check, X, Smile, Cloud, Package, Zap, FileText, Loader2, Trophy } from 'lucide-react'
import { cn } from '../../lib/utils'
import { uploadPhoto } from '../../lib/storage_service'
import { upsertDailyEntry } from '../../lib/entry_service'
import { compressImage } from '../../lib/image_service'
import { useToast } from '../ui/Toast';
import { TrophyGenerator } from '../../services/ai/TrophyGenerator';
import behaviorPlaybook from '../../config/behavior_playbook.json';

interface LogBoothProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (entry: any) => void;
    catName: string;
}

const VIBE_OPTIONS = [
    { score: 1, label: 'Happy', icon: '😊', color: 'text-emerald-400 bg-emerald-500/10' },
    { score: 2, label: 'Quiet', icon: '😌', color: 'text-blue-400 bg-blue-500/10' },
    { score: 3, label: 'Anxious', icon: '😟', color: 'text-amber bg-amber/10' },
    { score: 4, label: 'Hide-y', icon: '🫣', color: 'text-indigo-400 bg-indigo-500/10' },
    { score: 5, label: 'Energetic', icon: '⚡', color: 'text-orange-400 bg-orange-500/10' },
];

export const LogBooth: React.FC<LogBoothProps> = ({ isOpen, onClose, onSave, catName }) => {
    const { showToast } = useToast();
    const [step, setStep] = useState<'photo' | 'vibe' | 'behavior' | 'note'>('photo');
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [vibe, setVibe] = useState<number | null>(null);
    const [appetite, setAppetite] = useState<'good' | 'picky' | 'none'>('good');
    const [litter, setLitter] = useState<'normal' | 'off'>('normal');
    const [behavior, setBehavior] = useState<string | null>(null);
    const [note, setNote] = useState('');
    const [showPhotoError, setShowPhotoError] = useState(false);
    const [generatedTrophy, setGeneratedTrophy] = useState<any | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    if (!isOpen) return null;

    const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const preview = URL.createObjectURL(file);
            setPreviewUrl(preview);
            setStep('vibe');
        }
    };

    const handleSave = async () => {
        if (!selectedFile) {
            setShowPhotoError(true);
            setTimeout(() => setShowPhotoError(false), 3000);
            return;
        }
        if (!vibe) return;

        setIsUploading(true);
        try {
            // 1. Generate Trophy if behavior is tagged
            let trophy = null;
            if (behavior) {
                trophy = await TrophyGenerator.generateScene(catName, behavior);
                setGeneratedTrophy(trophy);
            }

            // 2. Compress the image before upload
            const compressedFile = await compressImage(selectedFile);

            // 3. Perform the physical upload
            const { storageKey, publicUrl } = await uploadPhoto("6a09dc55-3015-43d3-85a0-d0c1a822ad22", compressedFile);

            // 4. Save the full entry
            onSave({
                id: crypto.randomUUID(),
                date: new Date().toISOString(),
                vibe_score: vibe,
                appetite,
                litter,
                note: note,
                photoUrl: publicUrl,
                storageKey: storageKey,
                behaviorId: behavior,
                trophy: trophy
            });

            if (trophy) {
                showToast(`🏆 ${catName} earned a trophy!`, "success");
            } else {
                showToast("Activity recorded successfully", "success");
            }

            // Reset and close
            resetLog();
            onClose();
        } catch (err) {
            console.error("[LOGBOOTH] Save failed:", err);
            showToast("Failed to save activity. Please try again.", "error");
        } finally {
            setIsUploading(false);
        }
    };

    const resetLog = () => {
        setStep('photo');
        setPreviewUrl(null);
        setSelectedFile(null);
        setVibe(null);
        setAppetite('good');
        setLitter('normal');
        setBehavior(null);
        setNote('');
        setGeneratedTrophy(null);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-midnight/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full max-w-lg bg-surface sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[90vh] sm:h-auto animate-in slide-in-from-bottom-full duration-500 border border-white/5">
                {/* Header */}
                <div className="px-6 py-4 flex items-center justify-between border-b border-white/5">
                    <h2 className="text-lg font-bold text-accent">Log {catName}'s Vibe</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors"
                        aria-label="Close log booth"
                    >
                        <X size={20} className="text-accent/30" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Progress Indicator */}
                    <div className="flex gap-2">
                        {['photo', 'vibe', 'behavior', 'note'].map((s, i) => (
                            <div key={s} className={cn(
                                "h-1 flex-1 rounded-full transition-colors",
                                step === s ? "bg-amber" : "bg-white/10"
                            )} />
                        ))}
                    </div>

                    {step === 'photo' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-medium">Start with a photo</h3>
                                <p className="text-sm opacity-60">Photos help track physical changes over time.</p>
                            </div>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={cn(
                                    "aspect-[4/3] bg-white/5 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center space-y-4 cursor-pointer hover:bg-white/10 transition-colors group",
                                    showPhotoError ? "border-red-500/50 bg-red-500/5 animate-shake" : "border-white/10"
                                )}
                            >
                                <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center shadow-2xl border border-white/5 group-hover:scale-110 transition-transform">
                                    <Camera size={32} className={cn("text-amber", showPhotoError && "text-red-400")} />
                                </div>
                                <span className="text-sm font-medium text-accent/20">Tap to open camera</span>
                                {showPhotoError && (
                                    <div className="absolute inset-x-0 bottom-4 px-4">
                                        <div className="bg-red-500 text-white text-sm font-medium px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
                                            📸 A photo is required to create a memory
                                        </div>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    hidden
                                    ref={fileInputRef}
                                    onChange={handlePhotoCapture}
                                />
                            </div>

                        </div>
                    )}

                    {step === 'vibe' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-medium">How is {catName} today?</h3>
                                <p className="text-sm opacity-60">Swipe or tap the vibe that matches their state.</p>
                            </div>

                            {previewUrl && (
                                <div className="aspect-[4/3] w-full bg-neutral/10 rounded-2xl overflow-hidden relative border border-neutral/10">
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent" />
                                </div>
                            )}

                            {/* Horizontal Vibe Scroller */}
                            <div className="relative">
                                <div className="flex overflow-x-auto pb-6 -mx-6 px-6 gap-4 snap-x hide-scrollbar">
                                    {VIBE_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.score}
                                            onClick={() => {
                                                setVibe(opt.score);
                                                setStep('behavior');
                                            }}
                                            className={cn(
                                                "flex-shrink-0 w-32 aspect-square snap-center rounded-3xl border-2 flex flex-col items-center justify-center gap-2 transition-all active:scale-95 group",
                                                vibe === opt.score
                                                    ? "border-amber bg-amber/5 ring-4 ring-amber/10 shadow-xl"
                                                    : "border-white/5 bg-white/5"
                                            )}
                                        >
                                            <div className={cn("text-4xl", vibe === opt.score ? "scale-125 duration-300" : "opacity-60 group-hover:opacity-100 transition-opacity")}>
                                                {opt.icon}
                                            </div>
                                            <span className={cn(
                                                "text-[10px] font-bold uppercase tracking-wider",
                                                vibe === opt.score ? "text-amber" : "text-accent/20"
                                            )}>
                                                {opt.label}
                                            </span>
                                            {vibe === opt.score && (
                                                <div className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full animate-pulse" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                                {/* Gradient Fades */}
                                <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-surface to-transparent pointer-events-none" />
                                <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-surface to-transparent pointer-events-none" />
                            </div>

                            {/* Quick Log CTA */}
                            <div className="p-4 bg-amber/5 rounded-2xl border border-amber/10 flex items-center justify-between gap-4">
                                <div className="space-y-0.5">
                                    <h4 className="text-xs font-bold text-amber uppercase tracking-wider">Fast Track</h4>
                                    <p className="text-[10px] text-accent/40">Log with current defaults.</p>
                                </div>
                                <button
                                    onClick={() => {
                                        if (!vibe) setVibe(1);
                                        handleSave();
                                    }}
                                    className="px-4 py-2 bg-amber text-white text-xs font-bold rounded-xl shadow-lg shadow-amber/20 hover:scale-105 active:scale-95 transition-all"
                                >
                                    Quick Save
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'behavior' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-medium">Any specific behavior?</h3>
                                <p className="text-sm opacity-60">Tagging a behavior may earn {catName} a special trophy.</p>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                {behaviorPlaybook.categories.map(cat => (
                                    <div key={cat.id} className="space-y-2">
                                        <h4 className="text-[10px] font-bold uppercase tracking-wider opacity-40 ml-1">{cat.name}</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {cat.challenges.map(challenge => (
                                                <button
                                                    key={challenge.id}
                                                    onClick={() => {
                                                        setBehavior(challenge.id);
                                                        setStep('note');
                                                    }}
                                                    className={cn(
                                                        "p-3 rounded-2xl border text-left transition-all active:scale-95",
                                                        behavior === challenge.id
                                                            ? "border-amber bg-amber/5 ring-2 ring-amber/10 shadow-lg"
                                                            : "border-white/5 hover:border-amber/40 bg-white/5"
                                                    )}
                                                >
                                                    <div className="font-bold text-xs truncate">{challenge.name}</div>
                                                    <div className="text-[10px] opacity-40 truncate">{challenge.difficulty}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => {
                                    setBehavior(null);
                                    setStep('note');
                                }}
                                className="w-full py-3 text-sm font-medium opacity-40 hover:opacity-100 transition-opacity"
                            >
                                Skip behavior tagging
                            </button>
                        </div>
                    )}

                    {step === 'note' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-medium">Daily Routines</h3>
                                <p className="text-sm opacity-60">Quick update on vitals.</p>
                            </div>

                            {/* Routine Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-wider opacity-40 ml-1">Appetite</label>
                                    <div className="flex bg-white/5 p-1 rounded-xl gap-1">
                                        {[
                                            { id: 'good', label: '🍲' },
                                            { id: 'picky', label: '🥗' },
                                            { id: 'none', label: '🚫' }
                                        ].map(opt => (
                                            <button
                                                key={opt.id}
                                                onClick={() => setAppetite(opt.id as any)}
                                                className={cn(
                                                    "flex-1 py-2 rounded-lg text-lg transition-all",
                                                    appetite === opt.id ? "bg-white shadow-sm ring-1 ring-black/5" : "opacity-40 grayscale hover:grayscale-0"
                                                )}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-wider opacity-40 ml-1">Litter Box</label>
                                    <div className="flex bg-white/5 p-1 rounded-xl gap-1">
                                        {[
                                            { id: 'normal', label: '✅' },
                                            { id: 'off', label: '⚠️' }
                                        ].map(opt => (
                                            <button
                                                key={opt.id}
                                                onClick={() => setLitter(opt.id as any)}
                                                className={cn(
                                                    "flex-1 py-2 rounded-lg text-lg transition-all",
                                                    litter === opt.id ? "bg-white shadow-sm ring-1 ring-black/5" : "opacity-40 grayscale hover:grayscale-0"
                                                )}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <FileText className="absolute top-4 left-4 size-5 text-accent/20" />
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Add any specific details or notes..."
                                    className="w-full h-32 p-4 pl-12 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber/20 transition-all text-base resize-none text-accent"
                                />
                            </div>
                            <button
                                onClick={handleSave}
                                disabled={isUploading}
                                className="w-full py-4 bg-accent text-midnight rounded-2xl font-bold text-lg shadow-xl shadow-amber/20 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isUploading ? (
                                    <Loader2 className="animate-spin" size={24} />
                                ) : (
                                    <>
                                        {behavior ? <Trophy size={24} /> : <Check size={24} />}
                                        {behavior ? "Capture & Earn Trophy" : "Record Observation"}
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer Controls (for navigating back) */}
                {step !== 'photo' && (
                    <div className="px-6 py-4 border-t border-white/5 bg-white/5">
                        <button
                            onClick={() => {
                                if (step === 'vibe') setStep('photo');
                                else if (step === 'behavior') setStep('vibe');
                                else if (step === 'note') setStep('behavior');
                            }}
                            className="text-sm font-bold text-accent/30 hover:text-amber transition-colors"
                        >
                            ← Back
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
