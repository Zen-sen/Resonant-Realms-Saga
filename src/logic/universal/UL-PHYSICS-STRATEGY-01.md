# UL-PHYSICS-STRATEGY-01: Tribal Physics Mapping

**Universal Logic ID**: UL-PHYSICS-STRATEGY-01  
**Version**: 1.8.4  
**Date**: 2026-02-25  
**Status**: Production-Ready

---

## Purpose

Deterministic mapping of Tribal IDs (0-12) to Framer Motion configurations for the Resonant Realms Tribal Matrix Board.

---

## Physics Profiles

### Heavy Profile (Tribe 11 - Afrikaans)
```typescript
const TRIBE_11_PHYSICS: PhysicsConfig = {
  transition: {
    type: 'spring',
    stiffness: 300,
    damping: 15,
    mass: 1.2,
  },
  visualTreatment: 'heavy',
  colors: {
    primary: '#8B4513',      // Dark Oak
    secondary: '#36454F',    // Iron Gray
    accent: '#CD7F32',       // Copper
    glow: '#8B451340',
  },
  effects: {
    cameraShake: true,
    shakeIntensity: 0.3,
    bubbleParticles: false,
    visualTrails: true,
    trailLength: 8,
    floatAnimation: false,
  },
  audio: {
    frequency: 150,
    waveform: 'square',
    duration: 0.15,
  },
};
```

### Buoyant Profile (Tribe 5 - Sepedi)
```typescript
const TRIBE_5_PHYSICS: PhysicsConfig = {
  transition: {
    duration: 1.5,
    ease: 'easeInOut',
    type: 'tween',
  },
  visualTreatment: 'buoyant',
  colors: {
    primary: '#228B22',      // Forest Green
    secondary: '#90EE90',    // Pale Mint
    accent: '#98FB98',       // Light Green
    glow: '#90EE9060',
  },
  effects: {
    cameraShake: false,
    shakeIntensity: 0,
    bubbleParticles: true,
    bubbleCount: 5,
    visualTrails: false,
    floatAnimation: true,
  },
  audio: {
    frequency: 400,
    waveform: 'sine',
    duration: 0.3,
  },
};
```

### Synthesis Profile (Tribe 12 - The Bridge)
```typescript
const TRIBE_12_PHYSICS: PhysicsConfig = {
  transition: {
    type: 'spring',
    stiffness: 200,  // Midpoint of 300 and 100
    damping: 25,
    mass: 1.0,
  },
  visualTreatment: 'synthesis',
  colors: {
    primary: '#C0C0C0',      // Silver
    secondary: '#E0E0E0',    // Light Silver
    accent: '#FFFFFF',       // White Light
    glow: 'url(#prismaticGlow)',
  },
  effects: {
    cameraShake: true,
    shakeIntensity: 0.15,    // Half of Tribe 11
    bubbleParticles: true,
    bubbleCount: 3,          // Half of Tribe 5
    visualTrails: true,
    trailLength: 4,          // Half of Tribe 11
    floatAnimation: true,
  },
  audio: {
    frequency: 275,          // Midpoint of 150 and 400
    waveform: 'triangle',
    duration: 0.225,
  },
};
```

---

## API Reference

### getPhysicsConfig(tribeId: number): PhysicsConfig
Returns complete physics configuration for any tribe ID.

**Usage**:
```typescript
import { getPhysicsConfig } from './usePhysicsEngine';

const config = getPhysicsConfig(11); // Returns heavy profile
const transition = config.transition; // Framer Motion ready
```

### usePhysicsEngine(): PhysicsEngineAPI
Hook for managing physics effects in components.

**Returns**:
- `getPhysicsConfig(tribeId)` - Get config for tribe
- `triggerCameraShake(intensity, duration)` - Trigger screen shake
- `getBubbleConfig(tribeId)` - Get bubble particle config
- `getTrailConfig(tribeId)` - Get visual trail config
- `playPhysicsSound(tribeId)` - Play tribe-specific sound
- `getDropDuration(tribeId)` - Get drop animation duration

---

## Integration Points

| System | Integration | File |
|--------|-------------|------|
| Tile Component | `getMotionTransition()` | `src/components/game/Tile.tsx` |
| Match3Grid | `triggerCameraShake()` | `src/components/game/Match3Grid.tsx` |
| Audio System | `playPhysicsSound()` | `src/hooks/usePhysicsEngine.ts` |
| KYC Visuals | KYC Level 3 override | `src/components/game/Match3Grid.tsx` |

---

## Performance Considerations

- All transitions GPU-accelerated via Framer Motion
- CSS `will-change: transform` on animated elements
- `requestAnimationFrame` for camera shake (no layout thrashing)
- Audio context created on-demand (not on mount)

---

*Universal Logic Entry*  
*Resonant Realms Saga v1.8.4*
