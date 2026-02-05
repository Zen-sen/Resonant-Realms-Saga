// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

library AncestralUtils {
    /**
     * @notice Uses bitwise AND to check if a specific tribe's buff is active in the mask.
     */
    function hasBuff(uint256 _mask, uint256 _tribeId) internal pure returns (bool) {
        return (_mask & (1 << _tribeId)) != 0;
    }

    /**
     * @notice Performs a genetic crossover (Bitwise manipulation).
     */
    function crossover(uint256 _g1, uint256 _g2, uint256 _seed) internal pure returns (uint256) {
        uint256 mask = 0xFFFFFFFF00000000FFFFFFFF00000000FFFFFFFF00000000FFFFFFFF0000;
        uint256 mixed = (_g1 & mask) | (_g2 & ~mask);
        return mixed ^ uint256(keccak256(abi.encodePacked(_seed)));
    }
}
