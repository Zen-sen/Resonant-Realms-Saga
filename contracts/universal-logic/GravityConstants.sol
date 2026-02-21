pragma solidity 0.8.20;

import { AncestralUtils } from "../libraries/AncestralUtils.sol";

library GravityConstants {
    // Mass: How hard the "Old World" pulls on the tile (100 is standard)
    // Buoyancy: How much the tile resists falling (0 to 100)
    
    struct PhysicsProfile {
        int256 mass;
        int256 buoyancy;
    }

    function getProfile(uint256 tribeId) internal pure returns (PhysicsProfile memory) {
        if (tribeId == 0) { 
            // Khoe-San: The heavy, grounding foundation
            return PhysicsProfile(150, 0); 
        }
        if (tribeId == 1) {
            // Zulu: Lightning Mass
            AncestralUtils.PhysicsProfile memory profile = AncestralUtils.zuluConstants();
            return PhysicsProfile(profile.mass, profile.buoyancy);
        }
        if (tribeId == 2) {
            // Xhosa: Resonance Buoyancy
            AncestralUtils.PhysicsProfile memory profile = AncestralUtils.xhosaConstants();
            return PhysicsProfile(profile.mass, profile.buoyancy);
        }
        if (tribeId == 3) {
            // Sotho: Steadfast Bridge
            return PhysicsProfile(100, 30);
        }
        if (tribeId == 4) {
            // Setswana: Follows Sotho's bridge-logic
            return PhysicsProfile(100, 30);
        }
        if (tribeId == 5) {
            // Sepedi: Regenerative Buoyancy (healing physics)
            return PhysicsProfile(50, 90);
        }
        if (tribeId == 9) {
            // isiNdebele: Symmetric Harmony
            return PhysicsProfile(90, 50);
        }
        if (tribeId == 12) { 
            // Coloured Tribe: The buoyant Synthesis Bridge
            return PhysicsProfile(70, 80); 
        }
        // Standard Tribal density
        return PhysicsProfile(100, 10);
    }
}