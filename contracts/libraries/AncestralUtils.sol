// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

library AncestralUtils {
    // Tribal Bitmasks
    // Tribe 0 (Khoe-San): 1 (2^0)
    // Tribe 1: 2 (2^1)
    // Tribe 12 (Synthesis): 4096 (2^12)

    /**
     * @notice Check if a specific tribal buff is active in a bitmask
     * @param _mask The player's combined buff bitmask
     * @param _tribeId The ID of the tribe to check (0-12)
     */
    function hasBuff(uint256 _mask, uint256 _tribeId) internal pure returns (bool) {
        return (_mask & (1 << _tribeId)) != 0;
    }

    /**
     * @notice Adds a tribal buff to the mask
     */
    function addBuff(uint256 _mask, uint256 _tribeId) internal pure returns (uint256) {
        return _mask | (1 << _tribeId);
    }

    /**
     * @notice The Synthesis Logic: Logic for Tribe 12 to 'bridge' other buffs.
     * @dev Tribe 12 players can only hold ONE extra buff at a time from tribes 1-11.
     */
    function validateSynthesis(uint256 _mask) internal pure returns (bool) {
        // Count bits set between 1 and 11
        uint256 count = 0;
        for (uint256 i = 1; i <= 11; i++) {
            if (hasBuff(_mask, i)) {
                count++;
            }
        }
        return count <= 1; // Expert Mode: Only one borrowed power allowed
    }
}
