// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { LibAppStorage, AppStorage } from "../libraries/LibAppStorage.sol";

contract UbuntuGiftingFacet {
    event UbuntuGifted(address indexed from, address indexed to, uint256 amount, uint256 bonusApplied);

    function giftResonance(address _to, uint256 _amount) external {
        AppStorage storage s = LibAppStorage.diamondStorage();
        require(s.playerResonance[msg.sender] >= _amount, "Insufficient resonance");
        require(_to != msg.sender, "Ubuntu is collective");

        s.playerResonance[msg.sender] -= _amount;
        
        uint256 bonus = 0;
        if (s.playerTribe[msg.sender] == 12) {
            bonus = (_amount * 5) / 100;
        }

        s.playerResonance[_to] += (_amount + bonus);
        s.generosityRank[msg.sender] += (_amount / 10);

        uint256 tribeId = s.playerTribe[_to];
        s.tribePools[tribeId] += _amount;

        emit UbuntuGifted(msg.sender, _to, _amount, bonus);
    }

    function getGenerosityRank(address _player) external view returns (uint256) {
        return LibAppStorage.diamondStorage().generosityRank[_player];
    }

    /**
     * @notice Checks if a tribe has reached the "Awakened" threshold
     */
    function getTribeResonance(uint256 _tribeId) external view returns (uint256 current, uint256 threshold, bool isAwakened) {
        current = LibAppStorage.diamondStorage().tribePools[_tribeId];
        threshold = 1000; // Hardcoded threshold for v1.6.0
        isAwakened = (current >= threshold);
    }
}
