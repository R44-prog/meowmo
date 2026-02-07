import React, { useState, useEffect } from 'react';
import { Lock, Fingerprint, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PrivacyLockProps {
    children: React.ReactNode;
}

export const PrivacyLock: React.FC<PrivacyLockProps> = ({ children }) => {
    const [isLocked, setIsLocked] = useState(true);
    const [pin, setPin] = useState('');
    const [error, setError] = useState(false);
    const [isSimulatingBiometrics, setIsSimulatingBiometrics] = useState(false);

    const CORRECT_PIN = '1234'; // Default for Alpha

    const handlePinInput = (digit: string) => {
        if (pin.length < 4) {
            const newPin = pin + digit;
            setPin(newPin);
            if (newPin.length === 4) {
                if (newPin === CORRECT_PIN) {
                    unlock();
                } else {
                    setError(true);
                    setTimeout(() => {
                        setPin('');
                        setError(false);
                    }, 500);
                }
            }
        }
    };

    const unlock = () => {
        setIsLocked(false);
    };

    const simulateBiometrics = () => {
        setIsSimulatingBiometrics(true);
        setTimeout(() => {
            setIsSimulatingBiometrics(false);
            unlock();
        }, 1500);
    };

    if (!isLocked) {
        return <>{children}</>;
    }

    return (
        <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
            {/* Background Blur Simulation */}
            <div className="absolute inset-0 bg-white/40 backdrop-blur-xl -z-10" />

            <div className="w-full max-w-xs space-y-12 text-center">
                <div className="space-y-4">
                    <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-10 h-10 text-accent" />
                    </div>
                    <h2 className="text-2xl font-black tracking-tight text-accent">Meowmo Locked</h2>
                    <p className="text-sm text-neutral-500 font-medium">Enter PIN to access memories</p>
                </div>

                {/* PIN Dots */}
                <div className="flex justify-center gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className={cn(
                                "w-4 h-4 rounded-full border-2 transition-all duration-200",
                                pin.length > i
                                    ? "bg-accent border-accent scale-110"
                                    : "border-neutral-200",
                                error && "bg-red-500 border-red-500 animate-shake"
                            )}
                        />
                    ))}
                </div>

                {/* Number Pad */}
                <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <button
                            key={num}
                            onClick={() => handlePinInput(num.toString())}
                            className="w-16 h-16 rounded-full bg-white border border-neutral-100 text-xl font-bold text-accent shadow-sm active:scale-90 active:bg-neutral-50 transition-all flex items-center justify-center"
                        >
                            {num}
                        </button>
                    ))}
                    <div /> {/* Spacer */}
                    <button
                        onClick={() => handlePinInput('0')}
                        className="w-16 h-16 rounded-full bg-white border border-neutral-100 text-xl font-bold text-accent shadow-sm active:scale-90 active:bg-neutral-50 transition-all flex items-center justify-center"
                    >
                        0
                    </button>
                    <button
                        onClick={simulateBiometrics}
                        disabled={isSimulatingBiometrics}
                        className="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center active:scale-90 transition-all disabled:opacity-50"
                    >
                        {isSimulatingBiometrics ? <ShieldCheck className="w-8 h-8 animate-pulse" /> : <Fingerprint className="w-8 h-8" />}
                    </button>
                </div>

                <div className="pt-8">
                    <p className="text-xs text-neutral-400 font-medium">Security for your cat's privacy.</p>
                </div>
            </div>
        </div>
    );
};
