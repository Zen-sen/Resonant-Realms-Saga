// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { AncestralUtils } from "../libraries/AncestralUtils.sol";

/**
 * @title GravityConstants
 * @notice Maps all 13 tribes (0-12) to their physics profiles.
 * @dev Single source of truth: AncestralUtils library provides the canonical values.
 *      Tribes 0 (Khoe-San) and 12 (Synthesis) are defined inline as anchor points.
 */
library GravityConstants {
    // Mass: How hard the "Old World" pulls on the tile (100 is standard)
    // Buoyancy: How much the tile resists falling (0 to 100)
    
    struct PhysicsProfile {
        int256 mass;
        int256 buoyancy;
    }

    function getProfile(uint256 tribeId) internal pure returns (PhysicsProfile memory) {
        // ── Index 0: Khoe-San — The heavy, grounding foundation ──
        if (tribeId == 0) return PhysicsProfile(150, 0);

        // ── Index 1: Zulu — Lightning Mass ──
        if (tribeId == 1) {
            AncestralUtils.PhysicsProfile memory p = AncestralUtils.zuluConstants();
            return PhysicsProfile(p.mass, p.buoyancy);
        }
        // ── Index 2: Xhosa — Resonance Buoyancy ──
        if (tribeId == 2) {
            AncestralUtils.PhysicsProfile memory p = AncestralUtils.xhosaConstants();
            return PhysicsProfile(p.mass, p.buoyancy);
        }
        // ── Index 3: Sotho — Steadfast Bridge ──
        if (tribeId == 3) {
            AncestralUtils.PhysicsProfile memory p = AncestralUtils.sothoConstants();
            return PhysicsProfile(p.mass, p.buoyancy);
        }
        // ── Index 4: Setswana — Diplomatic Balance ──
        if (tribeId == 4) {
            AncestralUtils.PhysicsProfile memory p = AncestralUtils.setswanaConstants();
            return PhysicsProfile(p.mass, p.buoyancy);
        }
        // ── Index 5: Sepedi — Regenerative Healer ──
        if (tribeId == 5) {
            AncestralUtils.PhysicsProfile memory p = AncestralUtils.sepediConstants();
            return PhysicsProfile(p.mass, p.buoyancy);
        }
        // ── Index 6: Xitsonga — Xibelani Spin ──
        if (tribeId == 6) {
            AncestralUtils.PhysicsProfile memory p = AncestralUtils.xitsongaConstants();
            return PhysicsProfile(p.mass, p.buoyancy);
        }
        // ── Index 7: Swati — Ceremonial Dancer ──
        if (tribeId == 7) {
            AncestralUtils.PhysicsProfile memory p = AncestralUtils.swatiConstants();
            return PhysicsProfile(p.mass, p.buoyancy);
        }
        // ── Index 8: Venda — Mystic Anchor ──
        if (tribeId == 8) {
            AncestralUtils.PhysicsProfile memory p = AncestralUtils.vendaConstants();
            return PhysicsProfile(p.mass, p.buoyancy);
        }
        // ── Index 9: isiNdebele — Symmetric Harmony ──
        if (tribeId == 9) {
            AncestralUtils.PhysicsProfile memory p = AncestralUtils.ndebeleConstants();
            return PhysicsProfile(p.mass, p.buoyancy);
        }
        // ── Index 10: Tsonga — Coastal Drift ──
        if (tribeId == 10) {
            AncestralUtils.PhysicsProfile memory p = AncestralUtils.tsongaConstants();
            return PhysicsProfile(p.mass, p.buoyancy);
        }
        // ── Index 11: Afrikaans — Frontier Forge ──
        if (tribeId == 11) {
            AncestralUtils.PhysicsProfile memory p = AncestralUtils.afrikaansConstants();
            return PhysicsProfile(p.mass, p.buoyancy);
        }
        // ── Index 12: Synthesis — The buoyant Integration Bridge ──
        if (tribeId == 12) return PhysicsProfile(70, 80);

        // Unknown tribe — standard density fallback
        return PhysicsProfile(100, 10);
    }
}
