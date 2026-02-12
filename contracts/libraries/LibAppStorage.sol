// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/**
 * @title Resonant Realms Saga - Master Storage
 * @notice Integrated with Google Gravity / Anti-Pattern Physics
 */

struct Tribe {
    string name;
    uint256 baseResonance;
    bool isActive;
    // --- Anti-Gravity Expansion ---
    int256 mass;      // Standard is 100. (Khoe-San/Index 0 is higher)
    int256 buoyancy;  // Standard is 0. (Bridge/Index 12 is higher)
    uint256 tribeId;  // Explicit ID for lookup logic
}

struct Bunny {
    uint256 genes;
    uint256 birthTime;
    uint256 tribeId;
    uint256 generation;
    uint256 resonance;
    uint256 matronId;
    uint256 sireId;
    uint256 cooldownEnd;
}

struct Human {
    uint256 dna;
    uint256 awakenedTime;
    uint256 tribeId;
    uint256 level;
    uint256 ubuntuPower;
}

// Struct to track the "Google Gravity" state of tiles in the Match-3 engine
struct TilePhysics {
    int256 x;
    int256 y;
    int256 velocityY;
    bool isFloating;
}

struct AppStorage {
    // --- Diamond Standard Internals ---
    address contractOwner;
    mapping(bytes4 => address) selectorToFacet;
    address[] facets;

    // --- Tribal & Player State ---
    mapping(uint256 => Tribe) tribes;
    mapping(address => uint256) playerTribe;
    mapping(address => bool) hasJoinedTribe;
    mapping(address => uint256) playerResonance;
    mapping(address => uint256) playerBuffs;

    // --- Ubuntu & Mentorship Logic ---
    mapping(address => uint256) totalUbuntuPoints;
    mapping(address => uint256) generosityRank;
    mapping(address => uint256) lastGiftTime;
    mapping(uint256 => uint256) tribePools;

    // --- Entity Collections (Bunnies & Humans) ---
    mapping(uint256 => Bunny) bunnies;
    uint256 bunnyCount;
    mapping(uint256 => Human) humans;
    uint256 humanCount;
    mapping(uint256 => address) bunnyIndexToOwner;
    mapping(uint256 => address) humanIndexToOwner;
    mapping(address => uint256) ownerHumanCount;

    // --- Physics Engine State (The Mind Sync) ---
    mapping(uint256 => TilePhysics) bunnyPhysics; // Link physics to specific Sage/Bunny IDs
}

library LibAppStorage {
    function diamondStorage() internal pure returns (AppStorage storage ds) {
        // Hashed Storage Namespace as per v1.4.1 roadmap
        bytes32 position = keccak256("resonant.realms.storage");
        assembly {
            ds.slot := position
        }
    }
}