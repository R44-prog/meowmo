/**
 * Health Analysis Service
 * 
 * Implements anomaly detection based on Dr. Quinn's clinical benchmarks.
 * Analyzes timeline entries to identify concerning patterns and provide contextual insights.
 */

export interface TimelineEntry {
    id: string;
    date: string;
    vibe_score: number;
    appetite: 'good' | 'picky' | 'none';
    litter: 'normal' | 'off';
    note?: string;
    photoUrl?: string;
}

export interface HealthInsight {
    id: string;
    severity: 'info' | 'attention' | 'vet_recommended';
    pattern: string;
    title: string;
    description: string;
    detectedAt: string;
    relatedEntries: string[];
}

/**
 * Analyzes timeline entries for concerning patterns
 */
export function analyzeHealthPatterns(entries: TimelineEntry[], catName: string): HealthInsight[] {
    const insights: HealthInsight[] = [];
    const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Pattern 1: "Silent Pain" (Hide-y + No/Picky Appetite)
    const silentPainPattern = detectSilentPain(sortedEntries, catName);
    if (silentPainPattern) insights.push(silentPainPattern);

    // Pattern 2: "Metabolic Alert" (Good appetite + Litter issues)
    const metabolicPattern = detectMetabolicAlert(sortedEntries, catName);
    if (metabolicPattern) insights.push(metabolicPattern);

    // Pattern 3: "Anxiety Spike" (Sustained anxious vibes)
    const anxietyPattern = detectAnxietySpike(sortedEntries, catName);
    if (anxietyPattern) insights.push(anxietyPattern);

    // Pattern 4: General behavior change detection
    const behaviorChange = detectBehaviorChange(sortedEntries, catName);
    if (behaviorChange) insights.push(behaviorChange);

    return insights;
}

/**
 * Pattern 1: Silent Pain
 * Vibe: 4 (Hide-y) + Appetite: none/picky
 */
function detectSilentPain(entries: TimelineEntry[], catName: string): HealthInsight | null {
    const recentEntries = entries.slice(0, 7); // Last week
    const silentPainCount = recentEntries.filter(e =>
        e.vibe_score === 4 && (e.appetite === 'none' || e.appetite === 'picky')
    ).length;

    if (silentPainCount >= 2) {
        const relatedIds = recentEntries
            .filter(e => e.vibe_score === 4 && (e.appetite === 'none' || e.appetite === 'picky'))
            .map(e => e.id);

        return {
            id: crypto.randomUUID(),
            severity: 'vet_recommended',
            pattern: 'silent_pain',
            title: 'Unusual Hiding & Appetite Changes',
            description: `We noticed ${catName} has been hiding more than usual while also showing reduced appetite. Cats often hide when experiencing discomfort. This pattern may benefit from a veterinary check-in.`,
            detectedAt: new Date().toISOString(),
            relatedEntries: relatedIds
        };
    }

    return null;
}

/**
 * Pattern 2: Metabolic Alert
 * Appetite: good + Litter: off
 */
function detectMetabolicAlert(entries: TimelineEntry[], catName: string): HealthInsight | null {
    const recentEntries = entries.slice(0, 5);
    const metabolicIssues = recentEntries.filter(e =>
        e.appetite === 'good' && e.litter === 'off'
    ).length;

    if (metabolicIssues >= 2) {
        const relatedIds = recentEntries
            .filter(e => e.appetite === 'good' && e.litter === 'off')
            .map(e => e.id);

        return {
            id: crypto.randomUUID(),
            severity: 'attention',
            pattern: 'metabolic_alert',
            title: 'Digestive Pattern Noticed',
            description: `${catName} is eating well but we've noticed some changes in litter box habits. This combination sometimes suggests digestive sensitivity. Consider monitoring or discussing with your vet if it continues.`,
            detectedAt: new Date().toISOString(),
            relatedEntries: relatedIds
        };
    }

    return null;
}

/**
 * Pattern 3: Anxiety Spike
 * Vibe: 3 (Anxious) for 3+ consecutive days
 */
function detectAnxietySpike(entries: TimelineEntry[], catName: string): HealthInsight | null {
    const recentEntries = entries.slice(0, 7);

    // Check for 3+ consecutive anxious logs
    let consecutiveAnxious = 0;
    let maxConsecutive = 0;
    const anxiousIds: string[] = [];

    for (const entry of recentEntries) {
        if (entry.vibe_score === 3) {
            consecutiveAnxious++;
            anxiousIds.push(entry.id);
            maxConsecutive = Math.max(maxConsecutive, consecutiveAnxious);
        } else {
            consecutiveAnxious = 0;
        }
    }

    if (maxConsecutive >= 3) {
        return {
            id: crypto.randomUUID(),
            severity: 'attention',
            pattern: 'anxiety_spike',
            title: 'Sustained Anxious Behavior',
            description: `${catName} has been showing anxious behavior for ${maxConsecutive} consecutive days. This is worth noting. Consider recent environmental changes (new pets, construction, schedule shifts) or discuss with your vet if you're concerned.`,
            detectedAt: new Date().toISOString(),
            relatedEntries: anxiousIds.slice(0, maxConsecutive)
        };
    }

    return null;
}

/**
 * Pattern 4: General Behavior Change
 * Significant deviation from baseline
 */
function detectBehaviorChange(entries: TimelineEntry[], catName: string): HealthInsight | null {
    if (entries.length < 14) return null; // Need baseline data

    const recent = entries.slice(0, 7);
    const baseline = entries.slice(7, 21);

    const recentAvgVibe = recent.reduce((sum, e) => sum + e.vibe_score, 0) / recent.length;
    const baselineAvgVibe = baseline.reduce((sum, e) => sum + e.vibe_score, 0) / baseline.length;

    const vibeDiff = Math.abs(recentAvgVibe - baselineAvgVibe);

    if (vibeDiff >= 1.5) {
        const direction = recentAvgVibe < baselineAvgVibe ? 'more subdued' : 'more energetic';

        return {
            id: crypto.randomUUID(),
            severity: 'info',
            pattern: 'behavior_change',
            title: 'Mood Pattern Shift',
            description: `We noticed ${catName} has been ${direction} compared to the previous two weeks. This might be completely normal (seasonal changes, new routines), but it's worth keeping an eye on.`,
            detectedAt: new Date().toISOString(),
            relatedEntries: recent.map(e => e.id)
        };
    }

    return null;
}

/**
 * Get a user-friendly explanation of what triggered an insight
 */
export function getInsightContext(insight: HealthInsight): string {
    switch (insight.pattern) {
        case 'silent_pain':
            return 'Cats instinctively hide when they\'re in pain or discomfort. The combination of hiding behavior and reduced appetite is a pattern veterinarians look for.';
        case 'metabolic_alert':
            return 'Normal appetite with digestive changes can indicate food sensitivities, parasites, or other digestive issues. Most are easily treatable.';
        case 'anxiety_spike':
            return 'Sustained anxiety can impact your cat\'s health over time. Common triggers include environmental changes, but persistent anxiety may need professional assessment.';
        case 'behavior_change':
            return 'Tracking baseline behavior helps you spot changes early. Many changes are benign, but early detection of problems is always valuable.';
        default:
            return 'We analyze patterns in your cat\'s daily observations to help you spot changes that might be worth discussing with your vet.';
    }
}
