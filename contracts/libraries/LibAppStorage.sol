// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

struct Bunny {
    uint256 genes;
    uint64 birthTime;
    uint64 cooldownEndTime;
    uint32 matronId;
    uint32 sireId;
    uint16 generation;
}

struct AppStorage {
    // Tribe & Heritage State
    mapping(address => uint256) playerTribe;
    mapping(address => bool) isSage;
    mapping(address => uint256) ubuntuPoints; // <--- Fixed the missing link!
    
    // TrustBunnies State
    Bunny[] bunnies;
    mapping(uint256 => address) bunnyIndexToOwner;
    mapping(address => uint256) ownershipTokenCount;
    
    // Global Saga State
    address contractOwner;
    uint256 totalBunnies;
    string name;
    string symbol;
}

library LibAppStorage {
    function diamondStorage() internal pure returns (AppStorage storage ds) {
        assembly {
            ds.slot := 0
        }
    }
}
