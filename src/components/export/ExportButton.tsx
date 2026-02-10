import React, { useState } from 'react';
import { FileDown, Lock, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateVetExport, canExport, getExportOptions, TimelineEntry } from '@/lib/vet_export_service';
import { useToast } from '../ui/Toast';

interface ExportButtonProps {
    entries: TimelineEntry[];
    catName: string;
    isPremium: boolean;
    onUpgradeClick: () => void;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ entries, catName, isPremium, onUpgradeClick }) => {
    const { showToast } = useToast();
    const [selectedDays, setSelectedDays] = useState(7);
    const [isExporting, setIsExporting] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const exportOptions = getExportOptions(isPremium);
    const hasAccess = canExport(isPremium, selectedDays);

    const handleExport = async () => {
        if (!hasAccess) {
            onUpgradeClick();
            return;
        }

        setIsExporting(true);

        try {
            // Filter entries by date range
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - selectedDays);

            const filteredEntries = entries
                .filter(e => new Date(e.date) >= cutoffDate)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            if (filteredEntries.length === 0) {
                showToast(`No entries found in the last ${selectedDays} days.`, "info");
                setIsExporting(false);
                return;
            }

            // Small delay to allow UI to show loading state
            await new Promise(resolve => setTimeout(resolve, 500));

            generateVetExport(filteredEntries, catName, selectedDays);
            showToast("PDF exported successfully", "success");
            setIsDropdownOpen(false);
        } catch (error) {
            console.error('Export failed:', error);
            showToast("PDF generation failed. Please try again.", "error");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="relative">
            <div className="glass rounded-2xl p-4 border border-white/5 shadow-2xl">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <FileDown className="w-5 h-5 text-blue-600" />
                            <h3 className="text-sm font-bold text-accent">Vet Export</h3>
                            {!isPremium && (
                                <span className="text-[10px] px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full font-medium">
                                    Free: 7-day limit
                                </span>
                            )}
                            {isPremium && (
                                <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium flex items-center gap-1">
                                    <Check className="w-3 h-3" /> Premium
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-neutral/50">
                            Export {catName}'s health timeline as PDF for vet visits.
                        </p>
                    </div>
                </div>

                <div className="mt-4 flex gap-2">
                    {/* Day Selector (Dropdown for Premium) */}
                    {isPremium ? (
                        <div className="relative flex-1">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-full px-4 py-2 bg-neutral/5 border border-neutral/20 rounded-xl text-sm font-medium text-accent flex items-center justify-between hover:bg-neutral/10 transition-colors"
                            >
                                <span>Last {selectedDays} days</span>
                                <span className="text-xs opacity-40">▼</span>
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute top-full mt-1 left-0 right-0 glass border border-white/10 rounded-xl shadow-2xl overflow-hidden z-20">
                                    {exportOptions.map(days => (
                                        <button
                                            key={days}
                                            onClick={() => {
                                                setSelectedDays(days);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={cn(
                                                "w-full px-4 py-2 text-sm text-left hover:bg-neutral/5 transition-colors",
                                                selectedDays === days && "bg-blue-50 text-blue-600 font-medium"
                                            )}
                                        >
                                            Last {days} days
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex-1 px-4 py-2 bg-neutral/5 border border-neutral/10 rounded-xl text-sm font-medium text-neutral/40">
                            Last 7 days (Free)
                        </div>
                    )}

                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className={cn(
                            "px-6 py-2 rounded-xl font-medium text-sm flex items-center gap-2 transition-all",
                            isExporting && "opacity-70 cursor-not-allowed",
                            !isExporting && (hasAccess
                                ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                                : "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 active:scale-95")
                        )}
                    >
                        {isExporting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Exporting...
                            </>
                        ) : hasAccess ? (
                            <>
                                <FileDown className="w-4 h-4" />
                                Export PDF
                            </>
                        ) : (
                            <>
                                <Lock className="w-4 h-4" />
                                Unlock Premium
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
