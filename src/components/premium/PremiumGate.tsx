import React, { useEffect, useRef } from 'react';
import { X, Check, FileDown, Shield, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PremiumGateProps {
    isOpen: boolean;
    onClose: () => void;
    feature?: string;
}

export const PremiumGate: React.FC<PremiumGateProps> = ({ isOpen, onClose, feature }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    // Focus Trap & ESC key listener
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();

            if (e.key === 'Tab' && modalRef.current) {
                const focusableElements = modalRef.current.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0] as HTMLElement;
                const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

                if (e.shiftKey) { // Shift + Tab
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else { // Tab
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        };

        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);

        // Focus the first button on mount
        setTimeout(() => {
            const firstButton = modalRef.current?.querySelector('button');
            firstButton?.focus();
        }, 100);

        return () => {
            document.body.style.overflow = originalStyle;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleUpgrade = () => {
        // For MVP: Simulate premium upgrade
        localStorage.setItem('isPremium', 'true');
        alert('✨ Premium activated! (Demo mode)\n\nIn production, this would redirect to Stripe checkout.\n\nReload the page to see premium features.');
        onClose();
    };

    const features = [
        {
            icon: FileDown,
            title: 'Unlimited Vet Exports',
            description: 'Export 7, 14, 30, or 90-day timelines as PDF',
            highlight: feature === 'export'
        },
        {
            icon: Shield,
            title: 'Enhanced Health Logging',
            description: 'Unlock historical data and trend visualizers',
            highlight: false
        },
        {
            icon: Zap,
            title: 'Priority Support',
            description: 'Fast response times for urgent questions',
            highlight: false
        },
        {
            icon: Shield,
            title: 'Data Security',
            description: 'Cloud backup and multi-device sync',
            highlight: false
        }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div
                ref={modalRef}
                className="w-full max-w-md glass rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-500 border border-white/5"
                role="dialog"
                aria-modal="true"
                aria-labelledby="premium-modal-title"
            >
                {/* Header */}
                <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 px-6 py-8 text-white">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>

                    <div className="text-center space-y-2">
                        <div className="text-4xl">✨</div>
                        <h2 className="text-2xl font-bold">Unlock Premium</h2>
                        <p className="text-orange-100 text-sm">
                            Get unlimited access to all Meowmo features
                        </p>
                    </div>
                </div>

                {/* Features */}
                <div className="p-6 space-y-4">
                    {features.map((feat, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "flex gap-4 p-4 rounded-xl transition-all",
                                feat.highlight ? "bg-orange-50 border-2 border-orange-200" : "bg-neutral/5"
                            )}
                        >
                            <div className={cn(
                                "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
                                feat.highlight ? "bg-orange-500 text-white" : "bg-white text-orange-500"
                            )}>
                                <feat.icon size={20} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-bold text-accent mb-1">{feat.title}</h3>
                                <p className="text-xs text-neutral/60">{feat.description}</p>
                            </div>
                            <Check className="w-5 h-5 text-orange-500 flex-shrink-0 self-center" />
                        </div>
                    ))}
                </div>

                {/* Pricing */}
                <div className="px-6 pb-6 space-y-4">
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-5 border border-orange-100">
                        <div className="flex items-baseline justify-center gap-2 mb-2">
                            <span className="text-4xl font-black text-accent">$4.99</span>
                            <span className="text-sm text-neutral/50">/month</span>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-orange-600 font-medium">or $49/year (Save 20%)</p>
                        </div>
                    </div>

                    <button
                        onClick={handleUpgrade}
                        className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-orange-500/30 hover:from-orange-600 hover:to-orange-700 active:scale-98 transition-all"
                    >
                        Start 14-Day Free Trial
                    </button>

                    <p className="text-center text-xs text-neutral/40">
                        Cancel anytime. No commitment required.
                    </p>
                </div>
            </div>
        </div>
    );
};
