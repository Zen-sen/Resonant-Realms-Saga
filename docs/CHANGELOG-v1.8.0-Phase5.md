# 📜 CHANGELOG — v1.8.0-RESONANCE (Phase 5)
### Resonant Realms Saga — Phase 5 Implementation Log
**Date:** 2026-02-21  
**Session:** Phase 5: Xitsonga + Resonance Cascade Core Implementation  
**Previous Version:** v1.7.x (Phase 4 Complete — Tribes 1–5, 9, 12 active)  
**Status:** ✅ Core logic implemented, compiled, deployed to localhost

---

## 🔍 Session Objective

Implement Phase 5 of the Resonant Realms Saga: introduce **Tribe 6 (Xitsonga)** with its signature **Xibelani Spin mechanics**, where 5+ circular matches trigger chain reactions with a **+25% cascade bonus**. Additionally, implement the **Ubuntu Mercy Gen-2 breeding bonus** (500 UP for foundation-compliant descendants).

---

## ✨ Features Implemented

### 1. `contracts/libraries/AncestralUtils.sol` — Xitsonga Physics + Cascade Engine

**New function: `xitsongaConstants()`**  
Returns the Xibelani Spin physics profile:
- Mass: 100 (balanced centrifugal weight)
- Buoyancy: 50 (balanced lift from circular motion)

This positions Xitsonga as the "Spin" archetype — perfectly balanced between Zulu's raw power (180/20) and Xhosa's agile flow (80/60).

**New function: `calculateResonanceCascade(matches, duration)`**  
The centrifugal physics engine for the Xibelani dance:
- Returns 0 if matches < 5 (cascade threshold not met)
- For 5+ matches: computes base resonance from match count (×10) plus duration bonus (÷2)
- Applies the signature **+25% cascade multiplier** to the base
- Pure function — no state mutation, gas-efficient for repeated calculations

**Physics constants updated:**
- `zuluConstants()` comment refined: "Lightning Mass - High stability (Thunder)"
- `xhosaConstants()` comment refined: "Resonance Buoyancy - River flow"

---

### 2. `contracts/facets/AncestralHeritageFacet.sol` — Tribal Matrix + Cascade Recording

**`initializeTribalMatrix()` expanded:**  
Now seeds Tribe 6 (Xitsonga) directly in the initialization function alongside Khoe-San (0), Zulu (1), and Xhosa (2). Reads physics values from `AncestralUtils.xitsongaConstants()` to maintain single source of truth.

**New function: `recordResonanceCascade(bunnyId, matches, duration)`**  
On-chain Xibelani cascade trigger:
1. Validates caller owns the bunny
2. Delegates to `AncestralUtils.calculateResonanceCascade()` for the physics math
3. Requires bonus > 0 (reverts with "Resonance: Cascade failure" if threshold not met)
4. Credits the bunny's on-chain resonance score with the cascade bonus
5. Awards Ubuntu Points scaled to resonance gain (bonus × 10)
6. Emits `AscensionRitualComplete` event with tribe ID 6

---

### 3. `contracts/facets/BreedingFacet.sol` — Ubuntu Mercy Gen-2 Bonus

**New conditional logic in `breed()`:**  
After genetic crossover completes, the contract checks:
- Is the matron generation 1? (making the child generation 2)
- Does the child's DNA preserve Bit 0 (Khoe-San Foundation flag)?

If both conditions are met → the player is awarded **+500 Ubuntu Points** immediately. This incentivizes maintaining the Khoe-San foundation across generations, encoding the Ubuntu principle: *"I am because we are"* — the child inherits the ancestor's foundation.

---

### 4. `contracts/facets/ResonanceFacet.sol` — Bug Fix

**Missing import resolved:**  
`AncestralUtils` was being called in `recordFailure()` without being imported. Added `import { AncestralUtils } from "../libraries/AncestralUtils.sol";` — this was a pre-existing compilation blocker that surfaced during Phase 5 compilation.

---

### 5. `contracts/test/PhysicsVerification.sol` — Test Helper

**New function exposed: `calculateResonanceCascade(matches, duration)`**  
Wraps the internal library function as a public view, enabling Hardhat tests to call the cascade math directly without needing a deployed Diamond.

---

### 6. `scripts/deploy-phase5.js` — Deployment Automation

Full deployment script for Phase 5:
1. Deploys updated `AncestralHeritageFacet` as a new implementation contract
2. Deploys updated `BreedingFacet` as a new implementation contract
3. Executes a single-transaction **DiamondCut**:
   - **Replaces** existing Heritage selectors (initializeTribalMatrix, setTribe, joinTribe, selectSynthesisBuff, getPlayerStats, getTribeCount, getTribe)
   - **Adds** new selector: `recordResonanceCascade`
   - **Replaces** existing Breeding selectors (breed, getBunny, getBunniesByOwner, getBreedingCost, calculateBreedingCostExtended)
4. Calls `initializeTribalMatrix()` on the live Diamond to seed Xitsonga at Index 6
5. Prints confirmation of every step with contract addresses

**Note:** Originally created as `.ts` but converted to CommonJS `.js` due to ESM module resolution errors with the project's Hardhat configuration.

---

### 7. `test/Phase5.XitsongaResonance.test.ts` — Test Suite

Test suite covering three behavioral domains:

**Tribe 6 Physics:**
- Verifies Xitsonga is initialized with name "Xitsonga" and isActive = true

**Resonance Cascade:**
- Confirms cascade bonus fires correctly at 5+ circular matches
- Verifies revert with "Resonance: Cascade failure" when matches < 5

**Ubuntu Mercy:**
- Placeholder test for Gen-2 foundation-compliant UP bonus verification

**Note:** TypeScript test requires ESM/ts-node configuration to run — see Known Issues below.

---

## 🐛 Bug Fixes

| File | Issue | Fix |
|------|-------|-----|
| `ResonanceFacet.sol` | Missing `AncestralUtils` import — `recordFailure()` called `AncestralUtils.calculateAncestralWisdom()` without importing the library | Added import statement |

---

## 📁 Files Changed

### Modified
| File | Change Type | Description |
|------|------------|-------------|
| `contracts/libraries/AncestralUtils.sol` | Feature | Added `xitsongaConstants()` and `calculateResonanceCascade()` |
| `contracts/facets/AncestralHeritageFacet.sol` | Feature | Xitsonga in `initializeTribalMatrix()` + `recordResonanceCascade()` |
| `contracts/facets/BreedingFacet.sol` | Feature | Ubuntu Mercy Gen-2 bonus (500 UP) in `breed()` |
| `contracts/facets/ResonanceFacet.sol` | Bugfix | Added missing AncestralUtils import |
| `contracts/test/PhysicsVerification.sol` | Feature | Exposed `calculateResonanceCascade()` for testing |

### Created
| File | Description |
|------|-------------|
| `scripts/deploy-phase5.js` | Phase 5 deployment automation (DiamondCut + initialization) |
| `test/Phase5.XitsongaResonance.test.ts` | Phase 5 test suite (Xitsonga physics, cascade, Ubuntu Mercy) |
| `docs/CHANGELOG-v1.8.0-Phase5.md` | This document |

---

## 📊 Physics Registry Update

```
┌───────┬──────────┬──────┬──────────┬──────────────────────┐
│ Index │ Tribe    │ Mass │ Buoyancy │ Character            │
├───────┼──────────┼──────┼──────────┼──────────────────────┤
│   0   │ Khoe-San │  150 │     0    │ Heavy Foundation     │
│   1   │ Zulu     │  180 │    20    │ Thunder (Lightning)  │
│   2   │ Xhosa    │   80 │    60    │ River (Current)      │
│  *6*  │ Xitsonga │  100 │    50    │ Xibelani Spin (+25%) │  ← NEW
│  12   │ Synthesis│   70 │    80    │ Integration Bridge   │
└───────┴──────────┴──────┴──────────┴──────────────────────┘
```

*Tribes 3–5, 7–11 were seeded in the subsequent v1.8.1 session.*

---

## ⚙️ Deployment Log

```
🚀 PHASE 5 DEPLOYMENT: XITSONGA + RESONANCE CASCADE
============================================================
👤 Deployer: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
[1/2] Deploying AncestralHeritageFacet... ✅
[2/2] Deploying BreedingFacet... ✅
✅ Diamond Cut completed.
🌿 Initializing Phase 5 Tribal Matrix...
🎉 PHASE 5 DEPLOYMENT COMPLETE!
Diamond Address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

Network: localhost (Hardhat node)

---

## 🔮 Known Issues (at time of session)

| Item | Priority | Resolution |
|------|----------|------------|
| `Phase5.XitsongaResonance.test.ts` ESM import error | Medium | Needs ts-node or hardhat TypeScript config — resolved in v1.8.1 by using .js tests |
| Tribes 3–5, 7–11 not yet seeded in initializeTribalMatrix | Medium | Resolved in v1.8.1 |
| `deploy-phase5.ts` → `.js` conversion needed | Low | CommonJS required for current hardhat.config.cjs setup |

---

## 🔗 Follows From / Leads To

- **Follows:** Phase 4 (Setswana/Sepedi physics, ǃKaggen Glow sync, 35% Council Progress)
- **Leads To:** v1.8.1 (Full tribal matrix seeding, legacy test restoration, 68 tests passing)

---

*Logged by the Architect — v1.8.0-RESONANCE (Phase 5)*  
*"The Xibelani dance is now encoded — centrifugal force becomes cascade bonus, the circle creates the dance."*
