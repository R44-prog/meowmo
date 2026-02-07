/**
 * Offline Queue Service (Phase J Enhanced)
 * Manages pending uploads when the app is offline with auto-retry
 */

import { upsertDailyEntry } from './entry_service';
import { uploadPhoto } from './storage_service';

export interface PendingUpload {
    id: string;
    timestamp: number;
    userId: string;
    catId: string;
    vibeScore: number;
    note?: string;
    appetite?: 'good' | 'picky' | 'none';
    litter?: 'normal' | 'off';
    photoFile?: Blob; // Store the compressed blob
}

const QUEUE_KEY = 'meowmo_offline_queue';

export function getOfflineQueue(): PendingUpload[] {
    try {
        const queue = localStorage.getItem(QUEUE_KEY);
        return queue ? JSON.parse(queue) : [];
    } catch (err) {
        console.error('[OFFLINE_QUEUE] Failed to read queue:', err);
        return [];
    }
}

export function addToOfflineQueue(entry: Omit<PendingUpload, 'id' | 'timestamp'>): void {
    const queue = getOfflineQueue();
    const newItem: PendingUpload = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        ...entry
    };

    // Can't store Blob in localStorage, so we'd need IndexedDB for photo retry
    // For MVP, we skip photo on retry
    const { photoFile, ...storableData } = newItem;

    queue.push(storableData as PendingUpload);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    console.log('[OFFLINE_QUEUE] Added entry to queue. Total pending:', queue.length);
}

export function removeFromOfflineQueue(id: string): void {
    const queue = getOfflineQueue();
    const filtered = queue.filter(item => item.id !== id);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(filtered));
    console.log('[OFFLINE_QUEUE] Removed entry from queue. Remaining:', filtered.length);
}

export function clearOfflineQueue(): void {
    localStorage.removeItem(QUEUE_KEY);
    console.log('[OFFLINE_QUEUE] Queue cleared.');
}

export function getQueueCount(): number {
    return getOfflineQueue().length;
}

/**
 * Retry all pending uploads in the queue
 */
export async function retryOfflineQueue(
    onProgress?: (success: number, failed: number) => void
): Promise<{ success: number; failed: number }> {
    const queue = getOfflineQueue();

    if (queue.length === 0) {
        console.log('[OFFLINE_QUEUE] No pending entries to retry');
        return { success: 0, failed: 0 };
    }

    console.log(`[OFFLINE_QUEUE] Retrying ${queue.length} pending entries...`);

    let successCount = 0;
    let failedCount = 0;

    for (const item of queue) {
        try {
            // Attempt to re-upload the entry
            await upsertDailyEntry(item.userId, {
                catId: item.catId,
                vibeScore: item.vibeScore,
                note: item.note,
                appetite: item.appetite,
                litter: item.litter
            });

            // Success: remove from queue
            removeFromOfflineQueue(item.id);
            successCount++;

            if (onProgress) {
                onProgress(successCount, failedCount);
            }

        } catch (err) {
            console.error(`[OFFLINE_QUEUE] Failed to retry entry ${item.id}:`, err);
            failedCount++;

            if (onProgress) {
                onProgress(successCount, failedCount);
            }
        }
    }

    console.log(`[OFFLINE_QUEUE] Retry complete. Success: ${successCount}, Failed: ${failedCount}`);
    return { success: successCount, failed: failedCount };
}

/**
 * Initialize online/offline event listeners
 */
export function initOfflineQueue(onSyncComplete?: (result: { success: number; failed: number }) => void) {
    // Attempt retry when coming back online
    window.addEventListener('online', async () => {
        console.log('[OFFLINE_QUEUE] Network detected, attempting retry...');
        const result = await retryOfflineQueue();

        if (onSyncComplete) {
            onSyncComplete(result);
        }
    });

    // Log when going offline
    window.addEventListener('offline', () => {
        console.log('[OFFLINE_QUEUE] Network lost. Entries will be queued.');
    });
}
