import React, { useState, useRef, useEffect } from 'react';
import { Camera, Check, X, Smile, Cloud, Package, Zap, FileText, Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'
import { uploadPhoto } from '../../lib/storage_service'
import { upsertDailyEntry } from '../../lib/entry_service'
import { compressImage } from '../../lib/image_service'
import { useToast } from '../ui/Toast';

interface LogBoothProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (entry: any) => void;
    catName: string;
}

const VIBE_OPTIONS = [
    { score: 1, label: 'Happy', icon: '😊', color: 'text-emerald-500 bg-emerald-50' },
    { score: 2, label: 'Quiet', icon: '😌', color: 'text-blue-500 bg-blue-50' },
    { score: 3, label: 'Anxious', icon: '😟', color: 'text-amber-500 bg-amber-50' },
    { score: 4, label: 'Hide-y', icon: '🫣', color: 'text-indigo-500 bg-indigo-50' },
    { score: 5, label: 'Energetic', icon: '⚡', color: 'text-orange-500 bg-orange-50' },
];

export const LogBooth: React.FC<LogBoothProps> = ({ isOpen, onClose, onSave, catName }) => {
    const { showToast } = useToast();
    const [step, setStep] = useState<'photo' | 'vibe' | 'note'>('photo');
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [vibe, setVibe] = useState<number | null>(null);
    const [appetite, setAppetite] = useState<'good' | 'picky' | 'none'>('good');
    const [litter, setLitter] = useState<'normal' | 'off'>('normal');
    const [note, setNote] = useState('');
    const [showPhotoError, setShowPhotoError] = useState(false);
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
            // 1. Compress the image before upload
            const compressedFile = await compressImage(selectedFile);

            // 2. Perform the physical upload
            // Using the test cat ID for now
            const { storageKey, publicUrl } = await uploadPhoto("6a09dc55-3015-43d3-85a0-d0c1a822ad22", compressedFile);

            // 2. Save the full entry
            onSave({
                id: crypto.randomUUID(),
                date: new Date().toISOString(),
                vibe_score: vibe,
                appetite,
                litter,
                note: note,
                photoUrl: publicUrl,
                storageKey: storageKey
            });

            showToast("Activity recorded successfully", "success");

            // Reset and close
            setStep('photo');
            setPreviewUrl(null);
            setSelectedFile(null);
            setVibe(null);
            setAppetite('good');
            setLitter('normal');
            setNote('');
            onClose();
        } catch (err) {
            console.error("[LOGBOOTH] Save failed:", err);
            showToast("Failed to save activity. Please try again.", "error");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-lg bg-white sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[90vh] sm:h-auto animate-in slide-in-from-bottom-full duration-500">
                {/* Header */}
                <div className="px-6 py-4 flex items-center justify-between border-b border-neutral/10">
                    <h2 className="text-lg font-semibold text-accent">Log {catName}'s Vibe</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-neutral/5 rounded-full transition-colors"
                        aria-label="Close log booth"
                    >
                        <X size={20} className="opacity-40" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Progress Indicator */}
                    <div className="flex gap-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className={cn(
                                "h-1 flex-1 rounded-full transition-colors",
                                (i === 1 && step === 'photo') || (i === 2 && step === 'vibe') || (i === 3 && step === 'note')
                                    ? "bg-accent"
                                    : "bg-neutral/10"
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
                                    "aspect-[4/3] bg-neutral/5 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center space-y-4 cursor-pointer hover:bg-neutral/10 transition-colors group",
                                    showPhotoError ? "border-red-300 bg-red-50/50 animate-shake" : "border-neutral/20"
                                )}
                            >
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                    <Camera size={32} className={cn("text-accent", showPhotoError && "text-red-500")} />
                                </div>
                                <span className="text-sm font-medium opacity-40">Tap to open camera</span>
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

                            <button
                                onClick={async () => {
                                    // Simulation Mode
                                    const response = await fetch('https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=1000');
                                    const blob = await response.blob();
                                    const file = new File([blob], 'simulated-cat.jpg', { type: 'image/jpeg' });
                                    setSelectedFile(file);
                                    setPreviewUrl(URL.createObjectURL(file));
                                    setStep('vibe');
                                }}
                                id="simulate-photo-btn"
                                className="w-full py-3 border-2 border-accent/20 text-accent rounded-2xl font-medium hover:bg-accent/5 transition-colors flex items-center justify-center gap-2"
                            >
                                <span className="opacity-60">Testing?</span>
                                Simulate Photo Capture
                            </button>
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
                                                // Quick Log: If it's a "Happy" vibe, we can often skip the note for speed
                                                if (opt.score === 1) {
                                                    setStep('note');
                                                } else {
                                                    setStep('note');
                                                }
                                            }}
                                            className={cn(
                                                "flex-shrink-0 w-32 aspect-square snap-center rounded-3xl border-2 flex flex-col items-center justify-center gap-2 transition-all active:scale-95 group",
                                                vibe === opt.score
                                                    ? "border-accent bg-accent/5 ring-4 ring-accent/10"
                                                    : "border-neutral/10 bg-white"
                                            )}
                                        >
                                            <div className={cn("text-4xl", vibe === opt.score ? "scale-125 duration-300" : "opacity-60 group-hover:opacity-100 transition-opacity")}>
                                                {opt.icon}
                                            </div>
                                            <span className={cn(
                                                "text-[10px] font-bold uppercase tracking-wider",
                                                vibe === opt.score ? "text-accent" : "text-neutral/40"
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
                                <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none" />
                                <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
                            </div>

                            {/* Quick Log CTA */}
                            <div className="p-4 bg-accent/5 rounded-2xl border border-accent/10 flex items-center justify-between gap-4">
                                <div className="space-y-0.5">
                                    <h4 className="text-xs font-bold text-accent uppercase tracking-wider">Fast Track</h4>
                                    <p className="text-[10px] opacity-60">Log with current defaults.</p>
                                </div>
                                <button
                                    onClick={() => {
                                        if (!vibe) setVibe(1); // Default to happy if nothing selected
                                        handleSave();
                                    }}
                                    className="px-4 py-2 bg-accent text-white text-xs font-bold rounded-xl shadow-sm hover:scale-105 active:scale-95 transition-all"
                                >
                                    Quick Save
                                </button>
                            </div>
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
                                    <div className="flex bg-neutral/5 p-1 rounded-xl gap-1">
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
                                    <div className="flex bg-neutral/5 p-1 rounded-xl gap-1">
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
                                <FileText className="absolute top-4 left-4 size-5 opacity-20" />
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Add any specific details or notes..."
                                    className="w-full h-32 p-4 pl-12 bg-neutral/5 border border-neutral/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all text-base resize-none"
                                />
                            </div>
                            <button
                                onClick={handleSave}
                                disabled={isUploading}
                                className="w-full py-4 bg-accent text-white rounded-2xl font-bold text-lg shadow-lg shadow-accent/20 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isUploading ? (
                                    <Loader2 className="animate-spin" size={24} />
                                ) : (
                                    <>
                                        <Check size={24} />
                                        Record Observation
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer Controls (for navigating back) */}
                {step !== 'photo' && (
                    <div className="px-6 py-4 border-t border-neutral/10 bg-neutral/5">
                        <button
                            onClick={() => setStep(step === 'vibe' ? 'photo' : 'vibe')}
                            className="text-sm font-medium opacity-40 hover:opacity-100 transition-opacity"
                        >
                            ← Back to {step === 'vibe' ? 'photo' : 'vibe'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
