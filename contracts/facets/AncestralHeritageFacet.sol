// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { LibAppStorage, AppStorage } from "../libraries/LibAppStorage.sol";
import { AncestralUtils } from "../libraries/AncestralUtils.sol";

contract AncestralHeritageFacet {
    
    /**
     * @notice Initializes the base tribal matrix.
     * @dev Only the Architect (Contract Owner) can invoke this.
     */
    function initializeTribalMatrix() external {
        AppStorage storage s = LibAppStorage.diamondStorage();
        require(msg.sender == s.contractOwner, "Architect: Unauthorized");

        // Index 0: The Foundation (Khoe-San)
        s.tribes[0].name = "Khoe-San";
        s.tribes[0].isActive = true;

        // Index 12: The Synthesis (Coloured Tribe / Integration Layer)
        s.tribes[12].name = "Synthesis";
        s.tribes[12].isActive = true;
        
        // Note: Indices 1-11 would be seeded here in full production.
    }

    /**
     * @notice Allows a player to commit to a specific ancestral line.
     * @param _tribeId The ID of the tribe (0-12).
     */
    function joinTribe(uint256 _tribeId) external {
        AppStorage storage s = LibAppStorage.diamondStorage();
        require(s.tribes[_tribeId].isActive, "Tribe does not exist");
        
        s.playerTribe[msg.sender] = _tribeId;
        s.playerResonance[msg.sender] = 1;
        
        // Auto-assign the base tribal buff bit (Bitwise Shift)
        // This marks the bit at the position of the Tribe ID as 'active' (1)
        s.playerBuffs[msg.sender] = (1 << _tribeId);
    }

    /**
     * @notice The Balanced Bridge Move: Synthesis players choose their borrowed power.
     * @dev Only accessible by Tribe 12. Allows borrowing passives from Index 0-11.
     * @param _borrowedTribeId The tribe (0-11) to borrow a passive from.
     */
    function selectSynthesisBuff(uint256 _borrowedTribeId) external {
        AppStorage storage s = LibAppStorage.diamondStorage();
        
        // 1. Ensure the player belongs to the Integration Layer
        require(s.playerTribe[msg.sender] == 12, "Only Synthesis tribe can bridge");
        
        // 2. Validate the target (The Bridge reaches back to Foundation 0 through Tribe 11)
        require(_borrowedTribeId >= 0 && _borrowedTribeId < 12, "Invalid borrow target");

        // 3. Bitwise Synthesis: 
        // We keep the Tribe 12 bit (1 << 12) AND add the borrowed tribe bit (1 << _borrowedTribeId)
        // using the OR (|) operator.
        uint256 newMask = (1 << 12) | (1 << _borrowedTribeId);
        
        s.playerBuffs[msg.sender] = newMask;
    }

    /**
     * @notice Returns the current state of an initiate.
     */
    function getPlayerStats(address _player) external view returns (
        uint256 tribeId, 
        uint256 resonance, 
        uint256 buffMask
    ) {
        AppStorage storage s = LibAppStorage.diamondStorage();
        return (s.playerTribe[_player], s.playerResonance[_player], s.playerBuffs[_player]);
    }

    /**
     * @notice Helper to check tribal capacity.
     */
    function getTribeCount() external pure returns (uint256) {
        return 13;
    }

    /**
     * @notice Manual check for a specific tribe's existence in storage.
     */
    function getTribe(uint256 _tribeId) external view returns (string memory name, bool isActive) {
        AppStorage storage s = LibAppStorage.diamondStorage();
        return (s.tribes[_tribeId].name, s.tribes[_tribeId].isActive);
    }
}