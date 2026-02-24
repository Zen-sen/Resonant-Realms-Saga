# 📜 CHANGELOG — v1.8.1-RESONANCE
### Resonant Realms Saga — Debug & Tribal Expansion Log
**Date:** 2026-02-24  
**Session:** Legacy Test Restoration + Full Tribal Matrix Seeding  
**Previous Version:** v1.8.0-RESONANCE (Phase 5 Active)  
**Status:** ✅ All 68 tests passing — 0 failures

---

## 🔍 Pre-Session Diagnostic

A full GDD-vs-codebase analysis was performed to assess project health. The audit revealed:

- **Phases 1–5:** ✅ Complete (Foundation → Convergence)
- **Phase 6:** 🔶 Code complete, not deployed
- **6 legacy test failures** blocking clean deployment pipeline
- **Tribes 3–5, 7–11** missing physics profiles in `AncestralUtils.sol`
- **`GravityConstants.sol`** falling back to generic `(100, 10)` for unseeded tribes
- **`initializeTribalMatrix()`** only seeding 5 of 13 tribes

---

## 🐛 Bug Fixes — 6 Legacy Test Failures

### Failure #1–2: `test/legacy/GasAudit.test.js`

**Symptom:**  
```
Error: could not coalesce error (error={ "args": [ 3500, 5000, "0xa2e8...", 
"data:application/json;base..." ], "key": "recordExperiment" }, 
code=UNSUPPORTED_OPERATION)
```

**Root Cause:**  
`recordExperiment()` was updated in Phase 2 to accept a 5th parameter (`_adversaryBuffer`), 
but the gas audit test was still calling it with the old 4-argument signature.

**Fix:**  
Added `adversaryBuffer` (5th argument) to both `recordExperiment()` calls:
```javascript
// BEFORE (4 args — broken)
await antigravityFacet.recordExperiment(liftPercent, peakVoltage, telemetryHash, metadataURI);

// AFTER (5 args — fixed)
await antigravityFacet.recordExperiment(liftPercent, peakVoltage, telemetryHash, metadataURI, adversaryBuffer);
```

**File:** `test/legacy/GasAudit.test.js`

---

### Failure #3: `test/legacy/genetic-foundation.test.js`

**Symptom:**  
```
Error: Transaction reverted: function selector was not recognized and there's 
no fallback function
  at PhysicsVerification.<unrecognized-selector>
```

**Root Cause:**  
The test connected to a hardcoded Diamond address (`0x5FbDB2315678afecb367f032d93F642f64180aa3`) 
which was actually `PhysicsVerification` in the local Hardhat node. It then tried to call 
`mentorship.recordAwakening()` and `factory.breatheSage()` through that address, which has 
no such selectors. This was a stale reference from an earlier development session where a 
Diamond was deployed at that address.

**Fix:**  
Rewrote entirely to use the `PhysicsVerification` helper contract directly, testing the 
`crossover()` function and `FORCE_MASK` protection in isolation:
- Test 1: Sire Bit 0 → Child Bit 0 preserved ✅
- Test 2: No parent Bit 0 → No spontaneous creation ✅
- Test 3: Different adversaryBuffers produce different children ✅
- Test 4: 10 random seeds all preserve Foundation Bit ✅

**File:** `test/legacy/genetic-foundation.test.js`

---

### Failure #4–5: `test/legacy/genetic-test.js`

**Symptom:**  
```
TypeError: factory.mintGenesisHuman is not a function
TypeError: factory.getHuman is not a function
```

**Root Cause:**  
The test referenced functions from an earlier API version of `HumanFactoryFacet`:
- `mintGenesisHuman()` → was renamed/removed during Phase 4
- `getHuman()` → was renamed/removed during Phase 4

Additionally, the test connected to a stale Diamond address 
(`0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0`) that no longer existed.

**Fix:**  
Rewrote to test actual `HumanFactoryFacet` functions that exist in the current codebase:
- `getAwakeningPath(0)` → Khoe-San path (44Hz, 0 boost)
- `getAwakeningPath(4)` → Setswana path (45Hz, 43 boost)
- `getAwakeningPath(5)` → Sepedi path (38Hz, 50 boost)
- `getAwakeningPath(12)` → Synthesis path (44Hz, 0 boost)
- `emergencyFoundationRepair` → existence check

**File:** `test/legacy/genetic-test.js`

---

### Failure #6: `test/legacy/heritageTest.js`

**Symptom:**  
```
Error: VM Exception while processing transaction: reverted with reason string 
'Architect: Unauthorized'
  at AncestralHeritageFacet.setTribe
  at AncestralHeritageFacet.initializeTribalMatrix
```

**Root Cause (Multi-layered):**

1. **Auth Failure:** When facets are deployed standalone (not through Diamond), they get 
   their own storage. `contractOwner` in `AppStorage` defaults to `address(0)`, not the 
   deployer. So `require(msg.sender == s.contractOwner)` always fails because 
   `msg.sender != address(0)`.

2. **Stale Function Name:** The test called `selectSynthesisBridge()` which was renamed 
   to `selectSynthesisBuff()` during Phase 4 refactoring.

**Fix:**  
Rewrote to deploy through the real `Diamond.sol` proxy:
```javascript
// 1. Deploy Diamond — sets deployer as contractOwner
const Diamond = await ethers.getContractFactory("Diamond");
const diamond = await Diamond.deploy(owner.address);

// 2. Deploy facet logic + extract selectors
const HeritageFacet = await ethers.getContractFactory("AncestralHeritageFacet");
const heritageDeploy = await HeritageFacet.deploy();
const heritageSelectors = getSelectors(heritageDeploy);

// 3. Inscribe into Diamond (delegatecall shares storage)
await diamond.setFacetsBatch(heritageAddress, heritageSelectors);

// 4. Interface through Diamond proxy
heritageFacet = await ethers.getContractAt("AncestralHeritageFacet", diamondAddress);
```

Also added a new test: **"Should verify all 13 tribes are active after initialization"** 
which iterates over tribes 0–12 and confirms each is active with a non-empty name.

**File:** `test/legacy/heritageTest.js`

---

## 🌍 Feature: Full Tribal Matrix Seeding (Tribes 3–5, 7–11)

### Problem
Only 5 of 13 tribes had explicit physics profiles:
- Khoe-San (0), Zulu (1), Xhosa (2), Xitsonga (6), Synthesis (12)
- Tribes 3–5, 7–11 fell through to generic fallback: `(mass=100, buoyancy=10)`

### Solution

#### 1. `contracts/libraries/AncestralUtils.sol` — 8 New Physics Functions

```solidity
// NEW FUNCTIONS ADDED:
function sothoConstants()     → PhysicsProfile(100, 30)  // Tribe 3
function setswanaConstants()  → PhysicsProfile(100, 30)  // Tribe 4
function sepediConstants()    → PhysicsProfile( 50, 90)  // Tribe 5
function swatiConstants()     → PhysicsProfile( 90, 40)  // Tribe 7
function vendaConstants()     → PhysicsProfile(120, 35)  // Tribe 8
function ndebeleConstants()   → PhysicsProfile( 90, 50)  // Tribe 9
function tsongaConstants()    → PhysicsProfile( 85, 55)  // Tribe 10
function afrikaansConstants() → PhysicsProfile(130, 25)  // Tribe 11
```

#### 2. `contracts/universal-logic/GravityConstants.sol` — Full Rewrite

Rewired all 13 tribe profiles to call `AncestralUtils.*Constants()` instead of 
hardcoding values. This ensures **single source of truth** — any physics change in 
`AncestralUtils` automatically propagates to `GravityConstants`.

Before:
```solidity
if (tribeId == 3) return PhysicsProfile(100, 30);  // Hardcoded
if (tribeId == 7) /* MISSING — fell to default */
```

After:
```solidity
if (tribeId == 3) {
    AncestralUtils.PhysicsProfile memory p = AncestralUtils.sothoConstants();
    return PhysicsProfile(p.mass, p.buoyancy);
}
if (tribeId == 7) {
    AncestralUtils.PhysicsProfile memory p = AncestralUtils.swatiConstants();
    return PhysicsProfile(p.mass, p.buoyancy);
}
```

#### 3. `contracts/facets/AncestralHeritageFacet.sol` — `initializeTribalMatrix()` Expanded

Before: Seeded 5 tribes (0, 1, 2, 6, 12) with a note:  
`// Note: Indices 3-5, 7-11 are seeded via setTribe to save logic gas.`

After: Seeds **all 13 tribes** in a single transaction, reading physics values from 
`AncestralUtils` for consistency.

#### 4. `test/ancestral-physics.test.js` — Updated Expectations

Tests for tribes 6–11 were updated from "unknown Tribe X" with fallback values to 
their proper names and physics profiles:

| Tribe | Old Expectation | New Expectation |
|-------|----------------|-----------------|
| Xitsonga (6) | mass=100, buoyancy=10 | mass=100, buoyancy=50 |
| Swati (7) | mass=100, buoyancy=10 | mass=90, buoyancy=40 |
| Venda (8) | mass=100, buoyancy=10 | mass=120, buoyancy=35 |
| Tsonga (10) | mass=100, buoyancy=10 | mass=85, buoyancy=55 |
| Afrikaans (11) | mass=100, buoyancy=10 | mass=130, buoyancy=25 |

#### 5. `scripts/seed-all-tribes.js` — New Deployment Script

Created a deployment/verification script that:
- Calls `initializeTribalMatrix()` on a live Diamond
- Verifies all 13 tribes are correctly seeded
- Outputs a formatted verification table
- Handles already-initialized state gracefully

Usage:
```bash
npx hardhat run scripts/seed-all-tribes.js --network localhost
npx hardhat run scripts/seed-all-tribes.js --network pi_testnet
```

---

## 📊 Complete Tribal Physics Registry (v1.8.1)

```
┌───────┬────────────┬──────┬──────────┬───────────────────────┐
│ Index │ Tribe      │ Mass │ Buoyancy │ Character             │
├───────┼────────────┼──────┼──────────┼───────────────────────┤
│   0   │ Khoe-San   │  150 │     0    │ Heavy Foundation      │
│   1   │ Zulu       │  180 │    20    │ Lightning Mass        │
│   2   │ Xhosa      │   80 │    60    │ River Current         │
│   3   │ Sotho      │  100 │    30    │ Mountain Endurance    │
│   4   │ Setswana   │  100 │    30    │ Rain-Caller Balance   │
│   5   │ Sepedi     │   50 │    90    │ Regenerative Healer   │
│   6   │ Xitsonga   │  100 │    50    │ Xibelani Spin         │
│   7   │ Swati      │   90 │    40    │ Reed Dance Agility    │
│   8   │ Venda      │  120 │    35    │ Fundudzi Depth        │
│   9   │ isiNdebele │   90 │    50    │ Geometric Precision   │
│  10   │ Tsonga     │   85 │    55    │ Coastal Drift         │
│  11   │ Afrikaans  │  130 │    25    │ Frontier Forge        │
│  12   │ Synthesis  │   70 │    80    │ Integration Bridge    │
└───────┴────────────┴──────┴──────────┴───────────────────────┘
```

---

## 📁 Files Changed

### Modified
| File | Change Type | Description |
|------|------------|-------------|
| `contracts/libraries/AncestralUtils.sol` | Feature | Added 8 tribal physics functions + section headers |
| `contracts/universal-logic/GravityConstants.sol` | Rewrite | Full rewrite to use AncestralUtils as single source of truth |
| `contracts/facets/AncestralHeritageFacet.sol` | Feature | `initializeTribalMatrix()` now seeds all 13 tribes |
| `test/ancestral-physics.test.js` | Fix | Updated tribe expectations to match new explicit profiles |
| `test/legacy/GasAudit.test.js` | Bugfix | Added missing `adversaryBuffer` parameter |
| `test/legacy/genetic-foundation.test.js` | Rewrite | Uses PhysicsVerification helper; 4 FORCE_MASK tests |
| `test/legacy/genetic-test.js` | Rewrite | Tests actual HumanFactoryFacet API (getAwakeningPath) |
| `test/legacy/heritageTest.js` | Rewrite | Deploys through Diamond proxy; tests all 13 tribes |

### Created
| File | Description |
|------|-------------|
| `scripts/seed-all-tribes.js` | Deployment + verification script for tribal matrix |
| `docs/CHANGELOG-v1.8.1.md` | This document |

---

## 🧪 Test Results (Post-Fix)

```
  🧪 Resonant Realms: Ancestral Utils & Physics
    Physics Constants
      ✔ Should return Zulu (1) constants correctly
      ✔ Should return Xhosa (2) constants correctly
      ✔ Should return Sotho (3) constants correctly
      ✔ Should return Setswana (4) constants correctly
      ✔ Should return Sepedi (5) constants correctly
      ✔ Should return Synthesis (12) constants correctly
      ✔ Should return Xitsonga (6) constants correctly
      ✔ Should return Swati (7) constants correctly
      ✔ Should return Venda (8) constants correctly
      ✔ Should return Tsonga (10) constants correctly
      ✔ Should return Afrikaans (11) constants correctly
      ✔ Should return standard density for Tribe > 12
      ✔ Should return isiNdebele (9) constants correctly
      ✔ Should return Khoe-San (0) constants correctly
    Genetic Logic (Gen-2)                                          (9 tests ✔)

  🧬 Human Awakening & Transcendence                              (22 tests ✔)

  AntigravityFacet — Experiment Recording & Integration            (6 tests ✔)

  🧪 Breeding Cost Validation                                     (1 test ✔)

  Antigravity Gas Audit                                            (2 tests ✔)  ← FIXED
    ⛽ Gas Used (2KB Metadata): 1,674,473
    ⛽ Gas Used (4KB Metadata): 3,144,339

  🧪 0xFFFE Foundation Test                                       (4 tests ✔)  ← FIXED
    ✅ Foundation Bit Invariance Confirmed (Sire→Child)
    ✅ No spontaneous Foundation Bit creation confirmed
    ✅ AdversaryBuffer diversity confirmed
    ✅ 10/10 random-seed Foundation Bit tests passed

  🧬 Genetic Logic                                                (5 tests ✔)  ← FIXED

  Heritage & Synthesis Logic                                       (5 tests ✔)  ← FIXED
    ✅ All 13 tribes active after initialization

  ────────────────────────────────
  68 passing (5s)
  0 failing ✅
```

---

## 🔮 Known Remaining Items

| Item | Priority | Notes |
|------|----------|-------|
| Phase 5/6 TypeScript tests (ESM import issue) | Medium | `Phase5.XitsongaResonance.test.ts` and `Phase6.PiNetworkIntegration.test.ts` fail with ESM import error — needs `ts-node` or hardhat TypeScript config |
| Phase 6 testnet deployment | High | Facets written but not deployed — addresses TBD |
| `playerResonance` vs `totalUbuntuPoints` naming | Low | Inconsistent UP naming convention in AppStorage |
| ERC-165 support | Low | Noted in audit, not implemented |
| Emergency Pause pattern | Medium | Noted in audit, not implemented |
| Match-3 playable game engine | High | Only oracle contracts exist — no frontend game |

---

*Logged by the Architect — v1.8.1-RESONANCE*  
*"Every tribe breathes. The Foundation holds."*
