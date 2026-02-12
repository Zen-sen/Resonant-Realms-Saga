// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

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
        if (tribeId == 12) { 
            // Coloured Tribe: The buoyant Synthesis Bridge
            return PhysicsProfile(70, 80); 
        }
        // Standard Tribal density
        return PhysicsProfile(100, 10);
    }
}