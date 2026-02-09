// src/services/retention/RetentionService.ts
// Autonomous retention logic focusing on streaks and healthy habits.

import { db } from '@/services/db/meowmo_db';

export interface StreakStats {
    currentStreak: number;
    longestStreak: number;
    lastLogDate: string | null;
    isMilestoneReached: boolean;
}

export class RetentionService {
    /**
     * Calculates the current streak of consecutive logging days.
     */
    static async calculateStreak(catId: string): Promise<StreakStats> {
        const entries = await db.entries
            .where('catId')
            .equals(catId)
            .reverse()
            .sortBy('date');

        if (entries.length === 0) {
            return { currentStreak: 0, longestStreak: 0, lastLogDate: null, isMilestoneReached: false };
        }

        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;
        let lastDate: Date | null = null;

        const sortedEntries = entries.map(e => new Date(e.date)).sort((a, b) => b.getTime() - a.getTime());

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if the most recent log was today or yesterday to continue current streak
        const latestEntry = sortedEntries[0];
        latestEntry.setHours(0, 0, 0, 0);

        const diffInTime = today.getTime() - latestEntry.getTime();
        const diffInDays = diffInTime / (1000 * 3600 * 24);

        if (diffInDays > 1) {
            // Streak broken
            currentStreak = 0;
        }

        // Simple streak calculation logic
        for (let i = 0; i < sortedEntries.length; i++) {
            const current = sortedEntries[i];
            current.setHours(0, 0, 0, 0);

            if (lastDate) {
                const diff = lastDate.getTime() - current.getTime();
                const dayDiff = diff / (1000 * 3600 * 24);

                if (dayDiff === 1) {
                    tempStreak++;
                } else if (dayDiff > 1) {
                    tempStreak = 1;
                }
            } else {
                tempStreak = 1;
            }

            if (tempStreak > longestStreak) longestStreak = tempStreak;
            lastDate = current;
        }

        // Current streak logic with 1-day Grace Period
        currentStreak = 0;
        let checkDate = new Date(today);
        let gracePeriodUsed = false;

        // Sort entries by date descending
        const uniqueSortedDates = [...new Set(sortedEntries.map(d => d.getTime()))].sort((a, b) => b - a);

        for (let i = 0; i < uniqueSortedDates.length; i++) {
            const entryTime = uniqueSortedDates[i];
            const targetTime = checkDate.getTime();

            if (entryTime === targetTime) {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else if (entryTime < targetTime) {
                // Potential missed day
                if (!gracePeriodUsed) {
                    gracePeriodUsed = true;
                    checkDate.setDate(checkDate.getDate() - 1); // Skip one day

                    // Check again with the skipped day
                    if (entryTime === checkDate.getTime()) {
                        currentStreak++;
                        checkDate.setDate(checkDate.getDate() - 1);
                    } else {
                        break;
                    }
                } else {
                    break; // Already used grace period
                }
            }
        }

        return {
            currentStreak,
            longestStreak,
            lastLogDate: sortedEntries[0].toISOString(),
            isMilestoneReached: currentStreak > 0 && currentStreak % 7 === 0
        };
    }

    /**
     * Schedules a local notification (Quiet Reminder)
     * Demonstrating Phase M-3 "Smart Notifications"
     */
    static scheduleQuietReminder(catName: string) {
        if ('Notification' in window && Notification.permission === 'granted') {
            const hour = new Date().getHours();
            let message = `A quiet moment with ${catName}? 🐾`;

            if (hour > 18) message = `Evening check-in for ${catName}? 🌙`;
            if (hour < 10) message = `Good morning observation for ${catName}? ☀️`;

            new Notification("Meowmo", {
                body: message,
                icon: "/pwa-192x192.png",
                silent: true // "Quiet" pillar compliance
            });
        }
    }
}
