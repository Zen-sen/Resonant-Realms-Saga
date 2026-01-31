// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

struct Tribe {
    string name;
    string buff;
    bool isActive;
}

struct Bunny {
    uint256 genes;
    uint256 birthTime;
    uint256 cooldownEndTime;
    uint32 matronId;
    uint32 sireId;
    uint16 generation;
}

struct AppStorage {
    address contractOwner;
    mapping(bytes4 => address) selectorToFacet;
    
    // Tribal Data
    mapping(uint256 => Tribe) tribes;
    mapping(address => uint256) playerTribe;
    mapping(address => uint256) playerResonance;
    mapping(address => uint256) playerBuffs;
    
    // Bunny Data
    Bunny[] bunnies;
    mapping(uint256 => address) bunnyIndexToOwner;
    mapping(address => uint256) ownerBunnyCount;

    // Phase 4: Ubuntu Social Logic
    mapping(address => uint256) generosityRank;   // Points earned by giving
    mapping(uint256 => uint256) tribePools;       // Collective points per tribe index
    mapping(address => uint256) lastGiftTimestamp; // Cooldown for the "Gift of Life"
}

library LibAppStorage {
    function diamondStorage() internal pure returns (AppStorage storage ds) {
        bytes32 position = keccak256("resonantrealms.storage.main");
        assembly {
            ds.slot := position
        }
    }
}
