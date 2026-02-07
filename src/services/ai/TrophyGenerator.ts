/**
 * TrophyGenerator Service
 * Focus: High-quality AI-generated surreal scenes as rewards for behavioral captures.
 * Part of the "Join/Beat Them" strategy to drive viral engagement.
 */

export interface TrophyScene {
    id: string;
    challengeId: string;
    description: string;
    imageUrl: string;
    unlockedAt: string;
}

export class TrophyGenerator {
    /**
     * Simulation of AI Scene generation.
     * In a live environment, this would call specialized image generation APIs (DALL-E, Midjourney).
     */
    static async generateScene(catName: string, behavior: string): Promise<TrophyScene> {
        console.log(`[AI] Generating surreal trophy scene for ${catName} doing ${behavior}...`);

        // Simulating API latency
        await new Promise(resolve => setTimeout(resolve, 2000));

        const scenes: Record<string, { desc: string, url: string }> = {
            'loaf': {
                desc: `${catName} as a floating island in a sea of clouds.`,
                url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1000&auto=format&fit=crop'
            },
            'sploot': {
                desc: `${catName} stretching across the rings of Saturn.`,
                url: 'https://images.unsplash.com/photo-1573865662567-57636e3b564c?q=80&w=1000&auto=format&fit=crop'
            },
            'mid_yawn': {
                desc: `${catName}'s yawn echoing through a neon cyberpunk city.`,
                url: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?q=80&w=1000&auto=format&fit=crop'
            },
            'blep': {
                desc: `${catName} as the main exhibit in the Louvre.`,
                url: 'https://images.unsplash.com/photo-1533733508357-36105b58327d?q=80&w=1000&auto=format&fit=crop'
            }
        };

        const sceneData = scenes[behavior] || {
            desc: `${catName} in a majestic wonderland.`,
            url: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=1000&auto=format&fit=crop'
        };

        return {
            id: Math.random().toString(36).substr(2, 9),
            challengeId: behavior,
            description: sceneData.desc,
            imageUrl: sceneData.url,
            unlockedAt: new Date().toISOString()
        };
    }
}
