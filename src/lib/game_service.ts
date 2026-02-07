export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    isUnlocked: boolean;
    progress?: number; // 0 to 100
    color: string; // Tailwind gradient or class
}

interface Entry {
    date: string;
    vibe_score: number;
    [key: string]: any;
}

export const checkAchievements = (entries: Entry[], currentStreak: number): Achievement[] => {
    // 1. Trophy Definitions
    const trophies: Achievement[] = [
        {
            id: 'rookie',
            title: 'The Rookie',
            description: 'Log your first memory.',
            icon: '🐣',
            isUnlocked: false,
            color: 'from-blue-400 to-blue-600'
        },
        {
            id: 'on-fire',
            title: 'On Fire',
            description: 'Reach a 7-day streak.',
            icon: '🔥',
            isUnlocked: false,
            color: 'from-orange-400 to-red-500'
        },
        {
            id: 'dedicated',
            title: 'Dedicated',
            description: 'Log 30 total memories.',
            icon: '📅',
            isUnlocked: false,
            color: 'from-purple-400 to-indigo-600'
        },
        {
            id: 'zen-master',
            title: 'Zen Master',
            description: 'Log 5 "Happy" vibes in a row.',
            icon: '🧘',
            isUnlocked: false,
            color: 'from-green-400 to-emerald-600'
        }
    ];

    if (entries.length === 0) return trophies; // All locked

    // 2. Check Logic

    // Rookie
    if (entries.length > 0) {
        trophies.find(t => t.id === 'rookie')!.isUnlocked = true;
    }

    // On Fire
    if (currentStreak >= 7) {
        trophies.find(t => t.id === 'on-fire')!.isUnlocked = true;
        trophies.find(t => t.id === 'on-fire')!.progress = 100;
    } else {
        trophies.find(t => t.id === 'on-fire')!.progress = Math.min(100, (currentStreak / 7) * 100);
    }

    // Dedicated
    if (entries.length >= 30) {
        trophies.find(t => t.id === 'dedicated')!.isUnlocked = true;
        trophies.find(t => t.id === 'dedicated')!.progress = 100;
    } else {
        trophies.find(t => t.id === 'dedicated')!.progress = Math.min(100, (entries.length / 30) * 100);
    }

    // Zen Master (5 Happy in a row)
    // entries are typically sorted new -> old. Check the first 5.
    let recentHappyStreak = 0;
    for (let i = 0; i < Math.min(entries.length, 5); i++) {
        if (entries[i].vibe_score === 1) { // 1 = Happy
            recentHappyStreak++;
        } else {
            break;
        }
    }
    if (recentHappyStreak >= 5) {
        trophies.find(t => t.id === 'zen-master')!.isUnlocked = true;
        trophies.find(t => t.id === 'zen-master')!.progress = 100;
    } else {
        trophies.find(t => t.id === 'zen-master')!.progress = (recentHappyStreak / 5) * 100;
    }

    return trophies;
};
