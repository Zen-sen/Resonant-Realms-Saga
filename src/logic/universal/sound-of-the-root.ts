/**
 * @fileoverview Sound of the Root
 * Universal logic for foundation resonance.
 */

/**
 * Plays the "Foundation Sound" (Sound of the Root) using the Web Audio API.
 * 
 * @param ctx The AudioContext to use for playback.
 * @param frequency The base frequency to play (default: 44Hz).
 */
export function playFoundationSound(ctx: AudioContext, frequency: number = 44) {
    if (!ctx) return;

    try {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        // The Deep Root
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(frequency, ctx.currentTime);

        // The First Resonance (Unity Harmonic)
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(frequency * 2, ctx.currentTime);

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

        console.log(`🎵 Sound of the Root manifested (${frequency}Hz/${frequency * 2}Hz)`);
    } catch (e) {
        console.warn("Foundation Sound failed to manifest:", e);
    }
}
