// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

struct Tribe {
    string name;
    string buff;
    bool isActive;
}

struct Bunny {
    uint256 genes;
    uint64 birthTime;       // Matched to uint64 in your logic
    uint64 cooldownEndTime; // Matched to uint64 in your logic
    uint32 matronId;        // Matched to uint32 in your logic
    uint32 sireId;          // Matched to uint32 in your logic
    uint16 generation;      // Matched to uint16 in your logic
}

struct AppStorage {
    address contractOwner;
    mapping(address => uint256) playerTribe;
    mapping(address => bool) hasChosenTribe;
    mapping(address => uint256) ubuntuPoints;
    mapping(address => uint256) synthesisBuff;
    
    mapping(uint256 => Tribe) tribes;

    Bunny[] bunnies;
    mapping(uint256 => address) bunnyIndexToOwner; 
    mapping(address => uint256) ownerBunnyCount;
    uint256 totalBunnies; 
}

library LibAppStorage {
    function diamondStorage() internal pure returns (AppStorage storage ds) {
        bytes32 position = keccak256("diamond.standard.resonant.realms");
        assembly {
            ds.slot := position
        }
    }
}