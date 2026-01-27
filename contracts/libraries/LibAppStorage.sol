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
    // --- Diamond Governance ---
    address contractOwner;
    mapping(bytes4 => address) selectorToFacet; // The "Brain" is now protected here

    // --- Player Logic ---
    mapping(address => uint256) playerTribe;
    mapping(address => bool) hasChosenTribe;
    mapping(address => uint256) ubuntuPoints;
    mapping(address => uint256) synthesisBuff;
    
    // --- Ancestral Data ---
    mapping(uint256 => Tribe) tribes;
    Bunny[] bunnies;
    mapping(uint256 => address) bunnyIndexToOwner;
    mapping(address => uint256) ownerBunnyCount;
}

library LibAppStorage {
    // The "Secret Map" for the Resonant Realms Saga
    bytes32 constant STORAGE_SLOT = keccak256("diamond.standard.resonant.realms");

    function diamondStorage() internal pure returns (AppStorage storage ds) {
        bytes32 position = STORAGE_SLOT;
        assembly {
            ds.slot := position
        }
    }
}