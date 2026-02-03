// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

struct Tribe {
    string name;
    uint256 baseResonance;
    bool isActive;
}

struct Bunny {
    uint256 genes;
    uint256 birthTime;
    uint256 tribeId;
    uint256 generation;
    uint256 resonance;
    uint256 level;
    uint256 matronId;
    uint256 sireId;
    uint256 cooldownEnd;
}

struct AppStorage {
    // --- Diamond Standard Internals ---
    address contractOwner;
    mapping(bytes4 => address) selectorToFacet;
    address[] facets;

    // --- Resonant Realms: Tribal & Player Data ---
    mapping(uint256 => Tribe) tribes;
    mapping(address => uint256) playerTribe;
    mapping(address => bool) hasJoinedTribe;
    mapping(address => uint256) playerResonance;
    mapping(address => uint256) playerBuffs;
    mapping(address => uint256) totalUbuntuPoints;
    mapping(address => uint256) generosityRank;
    mapping(address => uint256) lastGiftTime;
    mapping(uint256 => uint256) tribePools; // The communal reservoir
    
    // --- Resonant Realms: Bunny Data ---
    mapping(uint256 => Bunny) bunnies;
    uint256 bunnyCount;
    mapping(uint256 => address) bunnyIndexToOwner;
    mapping(address => uint256) ownerBunnyCount;
}

library LibAppStorage {
    function diamondStorage() internal pure returns (AppStorage storage ds) {
        bytes32 position = keccak256("resonant.realms.storage");
        assembly {
            ds.slot := position
        }
    }
}
