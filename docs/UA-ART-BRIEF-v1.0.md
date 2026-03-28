# UA-ART-BRIEF-v1.0: The Resonant Realms Aesthetic

## 🏛️ The Vision: "Ancient-Future Resonance"

The game is not just a match-3 puzzle; it is a **Spiritual Technology**. The art style must feel like an ancient rock-art cave that has been "booted up" with high-definition digital energy.

---

## 🎨 1. The Foundation: Tribe 0 (Khoe-San)

### Philosophy
The Root, The Dreamtime, The Original Frequency.

### Palette
| Color | Hex | Usage |
|-------|-----|-------|
| Ochre | #CC7722 | Primary UI, ǃKaggen's glow |
| Deep Amber | #FFBF00 | Accents, highlights, Ubuntu Meter fill |
| Charcoal | #36454F | Text, shadows, depth layers |

### Textural Identity
- Raw stone surfaces
- Hand-etched petroglyphs
- Starlight filtering through dust particles
- Organic, weathered edges

### The Artist's Mandate
> **Avoid "clean" lines.** Everything should feel organic, ancient, and heavy with history. When ǃKaggen appears here, he is part of the shadows — not separate from them.

### Visual References
- San rock art from Tsodilo Hills
- Ochre pigment textures
- Ancient cave shadow play
- Dust motes in sunbeams

---

## 🌈 2. The Synthesis: Tribe 12 (The Coloured Tribe / The Bridge)

### Philosophy
The Integration Layer, Expert Mode, Multi-dimensional Synthesis.

### Palette
| Base | Refracted Colors | Usage |
|------|------------------|-------|
| Silver (#C0C0C0) or White Light | All 11 tribal hues | Prismatic refraction, no single dominant color |

### Textural Identity
- Polished glass surfaces
- Sacred geometry patterns
- "Digital Stained Glass" effect
- Kaleidoscopic motion

### The Artist's Mandate
> **This is "Expert Mode."** The UI should feel sophisticated, vibrant, and fast. It represents the modern synthesis of all previous 11 lessons. It must be **Kaleidoscopic** — ever-shifting, never static.

### Visual References
- Gothic cathedral rose windows (but digital)
- Prism light dispersion
- Holographic glass sculptures
- Geometric Islamic patterns

---

## 🦗 3. The Guide: ǃKaggen (Bunny #0)

### Archetype
The Trickster-Creator.

### Visual Key
A fusion of:
- **Mantis**: Limb structure, compound eyes, angular posture
- **Rabbit**: Silhouette, soft fur texture, gentle curves

### VFX Specification
| Feature | Effect | Trigger |
|---------|--------|---------|
| **Eyes** | "Code-Rain" or "Star-field" particle effect inside irises | Always active, subtle |
| **Gaze Direction** | Does not look *at* player; looks *through* player | Permanent stance |
| **Shadow Integration** | Part of background shadows in Tribe 0; crystalline transparency in Tribe 12 | Contextual to tribe |
| **Emote: Mirror** | 4-frame animation looking into fractured stone | Anxiety Spike events |

### Animation States
| State | Description |
|-------|-------------|
| **Idle** | Subtle sway, breathing motion, eyes pulsing with star-field |
| **Speaking** | Slight lean forward, eye glow intensifies |
| **Mirror Mode** | Turns to fractured stone, reflection shows player silhouette |
| **Synthesis Mode** | Body becomes semi-transparent prism, refracting background |

---

## 📂 UA-TECHNICAL-HUD-01: UI-to-Contract Mapping

**Logic Purpose:** Mapping the UI elements to the Smart Contract facets for real-time visual feedback.

| UI Element | Contract Source | Visual Behavior | Color/Effect |
|------------|-----------------|-----------------|------------|
| **Ubuntu Meter** | `UbuntuPointsFacet` | Fills with liquid Amber; pulses glow on "Mercy" events | Deep Amber (#FFBF00) liquid animation |
| **Resonance Bar** | `ResonanceFacet` | Vibrating string; frequency increases (Hz) as combos grow | Ochre to Gold gradient, wave motion |
| **The Shield** | `KycVerificationFacet` | Tribal sigil that brightens as KYC Level increases (0→3) | Level 0: Dim → Level 3: Radiant |
| **Adversary Buffer** | `AncestralUtils` (adversaryBuffer) | Stone cracks that heal into stronger patterns | Charcoal cracks → Amber healing glow |
| **Heritage Tile** | `AncestralHeritageFacet` | Glowing tribal sigil with countdown pulse | Tribe-specific color coding |
| **Flow State Indicator** | `UbuntuGiftingFacet` (Flow State) | Golden-Amber aura around grid when ≥1000 UP | Radial glow, particle effect |

---

## 🎬 Animation Specifications

### Transition: Tribe 0 → Tribe 12
**Duration:** 3 seconds  
**Effect:** Ochre stone texture gradually becomes transparent, revealing prismatic glass beneath. Petroglyphs morph into geometric patterns. Dust particles become light rays.

### Growth Catalyst Trigger
**Duration:** 6 seconds total  
**Sequence:**
1. **0.0s**: Screen shake + ǃKaggen appears from shadows (Tribe 0) or prism light (Tribe 12)
2. **0.5s**: ǃKaggen's Mirror text appears with ancient echo effect
3. **2.5s**: Ancestor Chorus line fades in with multi-voice whisper
4. **4.0s**: Reframe Prompt appears in player font, gentle pulse
5. **5.5s**: Mechanical Reward flashes with crystalline chime
6. **6.0s**: All elements fade, return to game

### Anxiety Spike Visual Cues
| Intensity | Visual Effect |
|-----------|---------------|
| **1 (Mild)** | Subtle screen desaturation, ǃKaggen's eyes appear in corner |
| **2 (Spike)** | Brief red tint flash, stone cracks appear on grid edges |
| **3 (Crisis)** | Grid "shatters" momentarily (visual only), ǃKaggen fully manifests |

---

## 🎨 Asset Production Checklist

### Priority 1: Foundation (Tribe 0)
- [ ] SPR_KAGGEN_01 (512x512 PNG, transparent)
- [ ] TILE_BASE_0 (Ochre stone, hand-etched texture)
- [ ] BG_FIRST_DREAM (Deep Umber/Nebula mix)
- [ ] VFX_UBUNTU_PULSE (Golden-Amber radial glow)

### Priority 2: Integration (Tribe 12)
- [ ] TILE_BASE_12 (Prismatic glass texture)
- [ ] BG_BRIDGE_SYNTH (Shifting Geometric Prism)
- [ ] ǃKaggen Synthesis Mode (prismatic transparency)

### Priority 3: Animation
- [ ] SPR_KAGGEN_EMOTE_MIRROR (4-frame loop)
- [ ] Tribe 0→12 transition sequence
- [ ] Growth Catalyst trigger sequence
- [ ] Anxiety Spike intensity effects

---

## 🧘 Artist's Philosophy Reminder

> "The game is not just a match-3 puzzle; it is a Spiritual Technology."

Every pixel should carry the weight of:
- **Ancient wisdom** (Khoe-San rock art, organic textures)
- **Future resonance** (digital energy, prismatic light)
- **The Bridge between** (ǃKaggen as the liminal guide)

**Avoid:**
- Clean, corporate lines
- Flat, lifeless colors
- Modern UI clichés (minimalism, neon, gradients without texture)

**Embrace:**
- Imperfection, weathering, history
- Light as a living entity
- The shadow as a teacher (not an enemy)

---

*Document generated by Narrative Intelligence Engine*  
*Resonant Realms Saga v1.8.0-RESONANCE*  
*Art Brief Version: 1.0 | Aesthetic Specification*
