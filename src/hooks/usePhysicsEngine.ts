import { useCallback, useRef } from 'react';
import { Transition } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// TRIBAL PHYSICS CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

export interface PhysicsConfig {
  // Framer Motion transition
  transition: Transition;
  // Visual treatment
  visualTreatment: 'heavy' | 'buoyant' | 'synthesis' | 'standard';
  // Color palette
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    glow: string;
  };
  // Effects
  effects: {
    cameraShake: boolean;
    shakeIntensity: number;
    bubbleParticles: boolean;
    bubbleCount: number;
    visualTrails: boolean;
    trailLength: number;
    floatAnimation: boolean;
  };
  // Audio characteristics
  audio: {
    frequency: number;
    waveform: 'square' | 'sine' | 'triangle';
    duration: number;
  };
}

// Tribe 11 (Afrikaans) - The Heavy/Industrial
const TRIBE_11_PHYSICS: PhysicsConfig = {
  transition: {
    type: 'spring',
    stiffness: 300,
    damping: 15,
    mass: 1.2,
  },
  visualTreatment: 'heavy',
  colors: {
    primary: '#8B4513',      // Saddle Brown - Dark Oak
    secondary: '#36454F',     // Charcoal - Iron Gray
    accent: '#CD7F32',        // Bronze - Copper highlights
    glow: '#8B451340',        // Subtle brown glow
  },
  effects: {
    cameraShake: true,
    shakeIntensity: 0.3,      // 30% screen shake on impact
    bubbleParticles: false,
    bubbleCount: 0,
    visualTrails: true,
    trailLength: 8,             // 8 frames of trail
    floatAnimation: false,
  },
  audio: {
    frequency: 150,             // Low metallic clank
    waveform: 'square',
    duration: 0.15,             // Short, sharp
  },
};

// Tribe 5 (Sepedi) - The Buoyant/Healing
const TRIBE_5_PHYSICS: PhysicsConfig = {
  transition: {
    duration: 1.5,
    ease: 'easeInOut',
    type: 'tween',
  },
  visualTreatment: 'buoyant',
  colors: {
    primary: '#228B22',       // Forest Green
    secondary: '#90EE90',     // Pale Green - Mint
    accent: '#98FB98',        // Pale Green - Light
    glow: '#90EE9060',        // Green glow
  },
  effects: {
    cameraShake: false,
    shakeIntensity: 0,
    bubbleParticles: true,
    bubbleCount: 5,             // 5 rising bubbles
    visualTrails: false,
    trailLength: 0,
    floatAnimation: true,
  },
  audio: {
    frequency: 400,             // Soft ethereal tone
    waveform: 'sine',
    duration: 0.3,            // Longer, flowing
  },
};

// Tribe 12 (Synthesis) - 50/50 blend of 11 and 5
const TRIBE_12_PHYSICS: PhysicsConfig = {
  transition: {
    type: 'spring',
    stiffness: 200,             // Midpoint between 300 and 100 (implied)
    damping: 25,              // Balanced
    mass: 1.0,
  },
  visualTreatment: 'synthesis',
  colors: {
    primary: '#C0C0C0',       // Silver
    secondary: '#E0E0E0',     // Light Silver
    accent: '#FFFFFF',        // White Light
    glow: 'url(#prismaticGlow)', // Prismatic gradient reference
  },
  effects: {
    cameraShake: true,
    shakeIntensity: 0.15,       // Half of Tribe 11
    bubbleParticles: true,
    bubbleCount: 3,             // Half of Tribe 5
    visualTrails: true,
    trailLength: 4,             // Half of Tribe 11
    floatAnimation: true,
  },
  audio: {
    frequency: 275,             // Midpoint between 150 and 400
    waveform: 'triangle',       // Blend of square and sine
    duration: 0.225,            // Midpoint
  },
};

// Default/Standard physics for other tribes
const STANDARD_PHYSICS: PhysicsConfig = {
  transition: {
    type: 'spring',
    stiffness: 250,
    damping: 20,
    mass: 1.0,
  },
  visualTreatment: 'standard',
  colors: {
    primary: '#CC7722',       // Foundation Ochre
    secondary: '#FFBF00',     // Deep Amber
    accent: '#F5DEB3',        // Bone White
    glow: '#FFBF0040',        // Amber glow
  },
  effects: {
    cameraShake: false,
    shakeIntensity: 0,
    bubbleParticles: false,
    bubbleCount: 0,
    visualTrails: false,
    trailLength: 0,
    floatAnimation: false,
  },
  audio: {
    frequency: 300,
    waveform: 'sine',
    duration: 0.2,
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// PHYSICS CONFIGURATION MAP
// ═══════════════════════════════════════════════════════════════════════════════

const PHYSICS_MAP: Record<number, PhysicsConfig> = {
  5: TRIBE_5_PHYSICS,
  11: TRIBE_11_PHYSICS,
  12: TRIBE_12_PHYSICS,
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get physics configuration for a specific tribe
 * @param tribeId - The tribe ID (0-12)
 * @returns PhysicsConfig with Framer Motion transition and visual settings
 */
export function getPhysicsConfig(tribeId: number): PhysicsConfig {
  return PHYSICS_MAP[tribeId] || STANDARD_PHYSICS;
}

/**
 * Hook for managing physics effects in the game
 */
export function usePhysicsEngine() {
  // Refs for managing active effects
  const shakeRef = useRef<HTMLDivElement>(null);
  const activeShakes = useRef<Set<string>>(new Set());

  /**
   * Trigger camera shake effect for heavy impacts
   * @param intensity - Shake intensity (0-1)
   * @param duration - Duration in ms
   */
  const triggerCameraShake = useCallback((intensity: number = 0.3, duration: number = 300) => {
    if (!shakeRef.current) return;

    const shakeId = `shake-${Date.now()}`;
    activeShakes.current.add(shakeId);

    // Apply shake transform
    const element = shakeRef.current;
    const startTime = Date.now();

    const shake = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= duration || !activeShakes.current.has(shakeId)) {
        // Reset transform
        element.style.transform = 'translate(0, 0)';
        activeShakes.current.delete(shakeId);
        return;
      }

      // Calculate decay
      const progress = elapsed / duration;
      const decay = 1 - progress;
      const currentIntensity = intensity * decay;

      // Random offset
      const offsetX = (Math.random() - 0.5) * 20 * currentIntensity;
      const offsetY = (Math.random() - 0.5) * 20 * currentIntensity;

      element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

      requestAnimationFrame(shake);
    };

    shake();
  }, []);

  /**
   * Generate bubble particle configuration
   * @param tribeId - The tribe ID
   * @returns Bubble configuration or null if not buoyant
   */
  const getBubbleConfig = useCallback((tribeId: number) => {
    const config = getPhysicsConfig(tribeId);
    if (!config.effects.bubbleParticles) return null;

    return {
      count: config.effects.bubbleCount,
      color: config.colors.secondary,
      size: { min: 2, max: 6 },
      riseSpeed: { min: 0.5, max: 1.5 },
      wobble: { min: -5, max: 5 },
      lifespan: { min: 2000, max: 4000 },
    };
  }, []);

  /**
   * Generate visual trail configuration
   * @param tribeId - The tribe ID
   * @returns Trail configuration or null if not heavy
   */
  const getTrailConfig = useCallback((tribeId: number) => {
    const config = getPhysicsConfig(tribeId);
    if (!config.effects.visualTrails) return null;

    return {
      length: config.effects.trailLength,
      color: config.colors.primary,
      opacity: 0.4,
      decay: 0.1,
    };
  }, []);

  /**
   * Play physics-based sound effect
   * @param tribeId - The tribe ID
   */
  const playPhysicsSound = useCallback((tribeId: number) => {
    const config = getPhysicsConfig(tribeId);

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      // Configure based on physics
      oscillator.type = config.audio.waveform;
      oscillator.frequency.setValueAtTime(config.audio.frequency, audioContext.currentTime);

      // Heavy tiles: fast drop, hard stop
      // Buoyant tiles: slow fade
      if (config.visualTreatment === 'heavy') {
        oscillator.frequency.exponentialRampToValueAtTime(
          config.audio.frequency * 0.5,
          audioContext.currentTime + config.audio.duration
        );
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + config.audio.duration);
      } else {
        gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.01, audioContext.currentTime + config.audio.duration);
      }

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + config.audio.duration);
    } catch (e) {
      // Audio not supported
    }
  }, []);

  /**
   * Get drop animation duration based on physics
   * @param tribeId - The tribe ID
   * @returns Duration in milliseconds
   */
  const getDropDuration = useCallback((tribeId: number): number => {
    const config = getPhysicsConfig(tribeId);

    if (config.visualTreatment === 'heavy') {
      // Heavy = faster drop (spring physics)
      return 400;
    } else if (config.visualTreatment === 'buoyant') {
      // Buoyant = slower, floating drop
      return 1500;
    } else if (config.visualTreatment === 'synthesis') {
      // Synthesis = balanced
      return 800;
    }

    return 600; // Standard
  }, []);

  return {
    getPhysicsConfig,
    triggerCameraShake,
    getBubbleConfig,
    getTrailConfig,
    playPhysicsSound,
    getDropDuration,
    shakeRef,
  };
}

export default usePhysicsEngine;
