// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { LibAppStorage, AppStorage } from "../libraries/LibAppStorage.sol";

contract AncestralHeritageFacet {
    
    function initializeTribalMatrix() external {
        AppStorage storage s = LibAppStorage.diamondStorage();
        require(msg.sender == s.contractOwner, "Architect: Unauthorized");

        // Index 0: The First Nations Foundation
        s.tribes[0].name = "Khoe-San";
        s.tribes[0].buff = "Ancient Resonance: Primordial Wisdom";
        s.tribes[0].isActive = true;

        // Note: In production, you'd loop to initialize 1-11
        // Index 12: The Synthesis (The Balanced Bridge)
        s.tribes[12].name = "Synthesis";
        s.tribes[12].buff = "The Balanced Bridge: Universal Passive Access";
        s.tribes[12].isActive = true;
    }

    function joinTribe(uint256 _tribeId) external {
        AppStorage storage s = LibAppStorage.diamondStorage();
        require(s.tribes[_tribeId].isActive, "Tribe does not exist in the matrix");
        
        s.playerTribe[msg.sender] = _tribeId;
        s.playerResonance[msg.sender] = 1; 
    }

    // --- ADDED GETTERS ---

    function getTribeCount() external pure returns (uint256) {
        return 13; // Representing the Council of 13
    }

    function getPlayerStats(address _player) external view returns (uint256, uint256) {
        AppStorage storage s = LibAppStorage.diamondStorage();
        return (s.playerTribe[_player], s.playerResonance[_player]);
    }
}