// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { AncestralUtils } from "../libraries/AncestralUtils.sol";
import { GravityConstants } from "../universal-logic/GravityConstants.sol";

/**
 * @title PhysicsVerification
 * @dev Test helper contract to expose internal/pure library functions.
 */
contract PhysicsVerification {
    
    function getProfile(uint256 tribeId) public pure returns (GravityConstants.PhysicsProfile memory) {
        return GravityConstants.getProfile(tribeId);
    }

    function calculateAncestralWisdom(uint256 _forgeFailure, uint256 _mindJitter) public pure returns (uint256) {
        return AncestralUtils.calculateAncestralWisdom(_forgeFailure, _mindJitter);
    }

    function crossover(
        uint256 _g1, 
        uint256 _g2, 
        uint256 _seed, 
        uint256 _adversaryBuffer
    ) public pure returns (uint256) {
        return AncestralUtils.crossover(_g1, _g2, _seed, _adversaryBuffer);
    }
}
