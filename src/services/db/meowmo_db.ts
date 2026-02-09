import Dexie, { Table } from 'dexie';

export interface LocalEntry {
    id?: string;
    catId: string;
    date: string;
    vibeScore: number;
    note?: string;
    appetite?: 'good' | 'picky' | 'none';
    litter?: 'normal' | 'off';
    photoUrl?: string;
    behaviorId?: string;
    trophy?: any;
    syncStatus: 'synced' | 'pending' | 'error';
    updatedAt: string;
}

export class MeowmoDB extends Dexie {
    entries!: Table<LocalEntry>;

    constructor() {
        super('MeowmoDB');
        this.version(1).stores({
            entries: '++id, catId, date, syncStatus'
        });
    }

    async saveEntry(entry: LocalEntry) {
        return await this.entries.put(entry);
    }

    async getRecentEntries(catId: string, limit = 50) {
        return await this.entries
            .where('catId')
            .equals(catId)
            .reverse()
            .limit(limit)
            .toArray();
    }

    async getPendingSync() {
        return await this.entries
            .where('syncStatus')
            .equals('pending')
            .toArray();
    }
}

export const db = new MeowmoDB();
