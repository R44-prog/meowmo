// src/lib/storage_service.ts
import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Milestone 8: Photo Pipeline Hardening
 * Real persistence using Supabase Storage with Mock Fallback.
 */

export async function uploadPhoto(catId: string, file: File | Blob): Promise<{ storageKey: string, publicUrl: string }> {
    const timestamp = Date.now();
    const fileName = `${timestamp}.jpg`;
    const storageKey = `cats/${catId}/${fileName}`;

    if (!isSupabaseConfigured) {
        console.warn("[STORAGE] Supabase not configured. Using local preview blob as mock persistence.");
        const mockUrl = URL.createObjectURL(file);
        // In mock mode, we just return the local blob URL. 
        // Note: This won't persist across refreshes unless we used IndexedDB, 
        // but for Milestone 8 architecture validation, it proves the flow works.
        return { storageKey, publicUrl: mockUrl };
    }

    // 1. Upload to 'vibe-cat-photos' bucket
    const { data, error } = await supabase.storage
        .from('vibe-cat-photos')
        .upload(storageKey, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) {
        console.error("[STORAGE] Upload failed:", error);
        throw error;
    }

    // 2. Get Public URL (or Signed URL if private)
    // For V1 Alpha, we'll use public URLs for simplicity if the bucket is public.
    const { data: { publicUrl } } = supabase.storage
        .from('vibe-cat-photos')
        .getPublicUrl(storageKey);

    console.log(`[STORAGE] Uploaded ${storageKey} successfully.`);
    return { storageKey, publicUrl };
}

export async function getPhotoUrl(storageKey: string): Promise<string> {
    if (!isSupabaseConfigured) {
        // In mock mode, we assume the key itself might be a blob URL or we return a placeholder
        return storageKey.startsWith('blob:') ? storageKey : `https://placekitten.com/400/300`;
    }

    const { data: { publicUrl } } = supabase.storage
        .from('vibe-cat-photos')
        .getPublicUrl(storageKey);

    return publicUrl;
}
