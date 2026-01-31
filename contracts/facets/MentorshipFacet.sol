// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { LibAppStorage, AppStorage } from "../libraries/LibAppStorage.sol";
import { AncestralUtils } from "../libraries/AncestralUtils.sol";

contract MentorshipFacet {
    event ResonanceIncreased(address indexed player, uint256 newScore, uint256 ubuntuEarned);

    /**
     * @notice Records gameplay success and mints resonance/points
     * @param _rawScore The score achieved in the Match-3 realm
     */
    function recordAwakening(uint256 _rawScore) external {
        AppStorage storage s = LibAppStorage.diamondStorage();
        uint256 currentMask = s.playerBuffs[msg.sender];
        
        uint256 multiplier = 100; // Base 1x (scaled by 100)

        // TRIBAL LOGIC
        // If Khoe-San (Bit 0) is active, +20% boost to resonance
        if (AncestralUtils.hasBuff(currentMask, 0)) {
            multiplier += 20;
        }

        // If Synthesis (Bit 12) is active, they get a 'Stability' bonus
        if (AncestralUtils.hasBuff(currentMask, 12)) {
            multiplier += 10;
        }

        uint256 ubuntuEarned = (_rawScore * multiplier) / 100;
        
        s.playerResonance[msg.sender] += ubuntuEarned;

        emit ResonanceIncreased(msg.sender, s.playerResonance[msg.sender], ubuntuEarned);
    }

    function getUbuntuPoints(address _player) external view returns (uint256) {
        return LibAppStorage.diamondStorage().playerResonance[_player];
    }
}
