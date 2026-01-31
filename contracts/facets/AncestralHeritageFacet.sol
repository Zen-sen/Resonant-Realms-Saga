// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { LibAppStorage, AppStorage } from "../libraries/LibAppStorage.sol";
import { AncestralUtils } from "../libraries/AncestralUtils.sol";

contract AncestralHeritageFacet {
    
    function initializeTribalMatrix() external {
        AppStorage storage s = LibAppStorage.diamondStorage();
        require(msg.sender == s.contractOwner, "Architect: Unauthorized");

        s.tribes[0].name = "Khoe-San";
        s.tribes[0].isActive = true;

        s.tribes[12].name = "Synthesis";
        s.tribes[12].isActive = true;
    }

    function joinTribe(uint256 _tribeId) external {
        AppStorage storage s = LibAppStorage.diamondStorage();
        require(s.tribes[_tribeId].isActive, "Tribe does not exist");
        
        s.playerTribe[msg.sender] = _tribeId;
        s.playerResonance[msg.sender] = 1;
        
        // Auto-assign the base tribal buff bit
        s.playerBuffs[msg.sender] = (1 << _tribeId);
    }

    /**
     * @notice The Balanced Bridge Move: Synthesis players choose their borrowed power.
     * @param _borrowedTribeId The tribe (1-11) to borrow a passive from.
     */
    function selectSynthesisBuff(uint256 _borrowedTribeId) external {
        AppStorage storage s = LibAppStorage.diamondStorage();
        require(s.playerTribe[msg.sender] == 12, "Only Synthesis tribe can bridge");
        require(_borrowedTribeId > 0 && _borrowedTribeId < 12, "Invalid borrow target");

        // Reset to base Tribe 12 buff, then add the new borrowed one
        uint256 newMask = (1 << 12) | (1 << _borrowedTribeId);
        
        s.playerBuffs[msg.sender] = newMask;
    }

    function getPlayerStats(address _player) external view returns (
        uint256 tribeId, 
        uint256 resonance, 
        uint256 buffMask
    ) {
        AppStorage storage s = LibAppStorage.diamondStorage();
        return (s.playerTribe[_player], s.playerResonance[_player], s.playerBuffs[_player]);
    }

    function getTribeCount() external pure returns (uint256) {
        return 13;
    }
}
