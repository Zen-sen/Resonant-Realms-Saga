/**
 * @fileoverview Sound of the Root
 * Universal logic for foundation resonance.
 */

/**
 * Plays the "Foundation Sound" (Sound of the Root) using the Web Audio API.
 * Frequency: 44Hz (Sub-bass) and 88Hz (Unity Harmonic).
 * 
 * @param ctx The AudioContext to use for playback.
 */
export function playFoundationSound(ctx: AudioContext) {
    if (!ctx) return;

    try {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        // 44Hz - The Deep Root
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(44, ctx.currentTime);

        // 88Hz - The First Resonance
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(88, ctx.currentTime);

        // Heavy, grounding envelope
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 1.6);
        osc2.stop(ctx.currentTime + 1.6);

        console.log("🎵 Sound of the Root manifested (44Hz/88Hz)");
    } catch (e) {
        console.warn("Foundation Sound failed to manifest:", e);
    }
}
