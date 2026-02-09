import React, { useMemo } from 'react';
import { AlertCircle, Info, AlertTriangle, ChevronDown, ChevronUp, FileDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { analyzeHealthPatterns, getInsightContext, HealthInsight, TimelineEntry } from '@/lib/health_analysis_service';

interface HealthInsightsProps {
    entries: TimelineEntry[];
    catName: string;
    onExportClick: () => void;
}

export const HealthInsights: React.FC<HealthInsightsProps> = ({ entries, catName, onExportClick }) => {
    const insights = useMemo(() => analyzeHealthPatterns(entries, catName), [entries, catName]);

    const [expandedId, setExpandedId] = React.useState<string | null>(null);

    if (insights.length === 0) {
        return (
            <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl animate-in fade-in duration-700">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                        <Info className="text-emerald-400" size={20} />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-emerald-400 mb-1">All Clear</h3>
                        <p className="text-sm text-emerald-400/80 leading-relaxed">
                            We haven't detected any concerning patterns in {catName}'s recent observations. Keep up the good tracking!
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <section className="space-y-4" aria-labelledby="health-insights-heading" role="region">
            <div className="flex items-center justify-between">
                <h2 id="health-insights-heading" className="text-lg font-bold text-accent">Health Insights</h2>
                <span className="text-xs font-medium text-accent/30 uppercase tracking-wider" aria-live="polite">
                    {insights.length} pattern{insights.length !== 1 ? 's' : ''} noticed
                </span>
            </div>

            {insights.map((insight) => (
                <InsightCard
                    key={insight.id}
                    insight={insight}
                    isExpanded={expandedId === insight.id}
                    onToggle={() => setExpandedId(expandedId === insight.id ? null : insight.id)}
                    onExportClick={onExportClick}
                />
            ))}
        </section>
    );
};

interface InsightCardProps {
    insight: HealthInsight;
    isExpanded: boolean;
    onToggle: () => void;
    onExportClick: () => void;
}

const InsightCard: React.FC<InsightCardProps> = ({ insight, isExpanded, onToggle, onExportClick }) => {
    const severityConfig = {
        info: {
            bg: 'bg-blue-50',
            border: 'border-blue-100',
            icon: Info,
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            textColor: 'text-blue-900',
            descColor: 'text-blue-700'
        },
        attention: {
            bg: 'bg-amber-50',
            border: 'border-amber-100',
            icon: AlertCircle,
            iconBg: 'bg-amber-100',
            iconColor: 'text-amber-600',
            textColor: 'text-amber-900',
            descColor: 'text-amber-700'
        },
        vet_recommended: {
            bg: 'bg-orange-50',
            border: 'border-orange-200',
            icon: AlertTriangle,
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-600',
            textColor: 'text-orange-900',
            descColor: 'text-orange-700'
        }
    };

    const config = severityConfig[insight.severity];
    const Icon = config.icon;

    return (
        <article
            className={cn("p-5 border rounded-2xl transition-all", config.bg, config.border)}
            role="article"
            aria-labelledby={`insight-title-${insight.id}`}
        >
            <div className="flex items-start gap-4">
                <div className={cn("flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center", config.iconBg)} aria-hidden="true">
                    <Icon className={config.iconColor} size={20} />
                </div>
                <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className={cn("font-bold mb-1", config.textColor)}>{insight.title}</h3>
                        <button
                            onClick={onToggle}
                            className={cn("p-1 rounded-lg hover:bg-black/5 transition-colors", config.textColor)}
                            aria-label={isExpanded ? "Collapse details" : "Expand details"}
                            aria-expanded={isExpanded}
                        >
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                    </div>
                    <p className={cn("text-sm leading-relaxed mb-3", config.descColor)}>
                        {insight.description}
                    </p>

                    {isExpanded && (
                        <div className={cn("pt-3 border-t space-y-3 animate-in fade-in slide-in-from-top-2 duration-200 border-white/5")}>
                            <div className="text-xs leading-relaxed text-accent/60">
                                <strong className="text-accent/90">Why we noticed this:</strong><br />
                                {getInsightContext(insight)}
                            </div>

                            {insight.severity === 'vet_recommended' && (
                                <button
                                    onClick={onExportClick}
                                    className="w-full py-2.5 glass border border-amber/20 rounded-xl font-bold text-xs text-amber hover:bg-amber/10 transition-colors flex items-center justify-center gap-2 uppercase tracking-widest shadow-xl"
                                >
                                    <FileDown size={14} />
                                    Export Timeline for Vet
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
};
