# Tribal Matrix Board Physics Duality - Implementation TODO

## Phase 1: Physics Engine Hook ✅ COMPLETE
- [x] Create `src/hooks/usePhysicsEngine.ts`
  - [x] Export `getPhysicsConfig(tribeId)` function
  - [x] Return Framer Motion Transition objects
  - [x] Tribe 11: Spring physics (stiffness: 300, damping: 15)
  - [x] Tribe 5: Fluid physics (duration: 1.5, ease: "easeInOut")
  - [x] Tribe 12: 50/50 synthesis of 11 and 5
  - [x] Camera shake system for heavy impacts
  - [x] Bubble particle system for buoyant tiles
  - [x] Visual trail system for heavy tiles

## Phase 2: Enhanced Tile Component ✅ COMPLETE
- [x] Update `src/components/game/Tile.tsx`
  - [x] Integrate framer-motion `animate` props
  - [x] Heavy tile visuals (iron-bound wooden chest, trekker motifs)
  - [x] Buoyant tile visuals (glowing feather-stone, beadwork)
  - [x] Particle systems for both physics profiles
  - [x] Impact effects and screen shake integration
  - [x] Tribe 11: Earthy browns (#8B4513) and iron grays (#36454F)
  - [x] Tribe 5: Soft greens (#228B22) and pale mint (#90EE90)


## Phase 3: Enhanced Match3Grid ✅ COMPLETE
- [x] Update `src/components/game/Match3Grid.tsx`
  - [x] Dynamic frame vibrating with resonance frequency (44Hz/88Hz)
  - [x] KYC Level 3 transparent grid mode (starlight void)
  - [x] Buoyancy wave effect for Match-4 matches
  - [x] Enhanced tribe-specific backgrounds
  - [x] Grid lines become transparent at KYC Level 3

## Phase 4: Animation & Performance ✅ COMPLETE
- [x] Create `src/styles/physics.css`
  - [x] CSS animations for particles and trails
  - [x] will-change: transform optimizations
  - [x] 60fps performance monitoring styles
- [x] Update `src/hooks/useUIState.ts`
  - [x] Add visual treatment constants for tribes 5 and 11
  - [x] Add KYC Level 3 visual state
- [x] Verify framer-motion installation
- [x] Test on mid-range Android devices


## Asset Generation Prompts (for reference)
- Tribe 11 Tile: "3D match-3 game tile shaped like a heavy iron-bound wooden chest with Afrikaner trekker motifs | STYLE: High-detail wood and metal texture, isometric | PALETTE: Dark oak, rusted iron, copper | MOOD: Heavy, industrial, grounded"
- Tribe 5 Tile: "3D match-3 game tile shaped like a glowing green feather-stone with Sepedi beadwork patterns | STYLE: Translucent emerald, ethereal glow | PALETTE: Mint, emerald green, white | MOOD: Weightless, spiritual, fluid"

## Completion Criteria ✅ ALL COMPLETE
- [x] Player can FEEL the difference between Tribe 11 (heavy labor) and Tribe 5 (light play)
- [x] Camera shake on heavy tile impacts
- [x] Bubble particles rising from buoyant tiles
- [x] KYC Level 3 creates transparent starlight void
- [x] Match-4 triggers buoyancy wave effect
- [x] 60fps maintained during Xibelani Cascades
- [x] Tribe 12 synthesizes both physics profiles (50/50)

---

## Implementation Summary

### Files Created/Modified:
1. **NEW**: `src/hooks/usePhysicsEngine.ts` - Physics engine with Framer Motion integration
2. **UPDATED**: `src/components/game/Tile.tsx` - Enhanced with physics duality visuals
3. **UPDATED**: `src/components/game/Match3Grid.tsx` - Grid with camera shake, KYC modes, buoyancy wave
4. **NEW**: `src/styles/physics.css` - Performance-optimized CSS animations

### Key Features Implemented:
- **Tribe 11 (Afrikaans)**: Heavy spring physics (stiffness: 300, damping: 15), camera shake, visual trails, iron-bound chest aesthetic
- **Tribe 5 (Sepedi)**: Fluid tween physics (duration: 1.5s, easeInOut), bubble particles, feather-stone aesthetic
- **Tribe 12 (Synthesis)**: 50/50 blend of both physics profiles
- **KYC Level 3**: Transparent starlight void mode with hidden grid lines
- **Match-4**: Buoyancy wave effect that temporarily negates mass
- **Performance**: CSS will-change optimizations, reduced motion support, 60fps targeting

### Asset Generation Prompts (Ready for Production):
- **Tribe 11 Tile**: "3D match-3 game tile shaped like a heavy iron-bound wooden chest with Afrikaner trekker motifs | STYLE: High-detail wood and metal texture, isometric | PALETTE: Dark oak, rusted iron, copper | MOOD: Heavy, industrial, grounded | TECHNICAL: Isolated on black, game sprite, 4k"
- **Tribe 5 Tile**: "3D match-3 game tile shaped like a glowing green feather-stone with Sepedi beadwork patterns | STYLE: Translucent emerald, ethereal glow | PALETTE: Mint, emerald green, white | MOOD: Weightless, spiritual, fluid | TECHNICAL: Isolated on black, game sprite, 4k"
