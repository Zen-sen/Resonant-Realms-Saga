// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

struct Tribe {
    string name;
    string buff;
    bool isActive;
}

struct Bunny {
    uint256 genes;
    uint64 birthTime;
    uint64 cooldownEndTime;
    uint32 matronId;
    uint32 sireId;
    uint16 generation;
}

struct AppStorage {
    // --- Ancestral Game Data ---
    mapping(uint256 => Tribe) tribes;
    mapping(uint256 => address) bunnyIndexToOwner;
    Bunny[] bunnies;
    mapping(address => uint256) ownerBunnyCount;
    mapping(address => uint256) playerTribe;      // Critical for joinTribe
    mapping(address => uint256) playerResonance;  // Critical for Stats
    
    // --- Diamond Infrastructure ---
    mapping(bytes4 => address) selectorToFacet;   // Required for Diamond proxy routing
    address contractOwner;
}

library LibAppStorage {
    /**
     * @dev Compute the storage slot at compile time using Yul-style keccak256.
     * In 0.8.20, keccak256("string literal") is a constant expression, 
     * avoiding the assembly misalignment that triggered the TypeError.
     */
    bytes32 constant STORAGE_SLOT = keccak256("resonantrealms.storage.main");

    function diamondStorage() internal pure returns (AppStorage storage ds) {
        bytes32 slot = STORAGE_SLOT;
        assembly {
            ds.slot := slot
        }
    }
}