// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

library AncestralUtils {
    struct PhysicsProfile {
        int256 mass;
        int256 buoyancy;
    }

    /**
     * @notice Zulu (1): Lightning Mass - High stability, resists high-voltage jitter.
     */
    function zuluConstants() internal pure returns (PhysicsProfile memory) {
        return PhysicsProfile(180, 20);
    }

    /**
     * @notice Xhosa (2): Resonance Buoyancy - Increased lift efficiency in lower kV.
     */
    function xhosaConstants() internal pure returns (PhysicsProfile memory) {
        return PhysicsProfile(80, 60);
    }

    /**
     * @notice Uses bitwise AND to check if a specific tribe's buff is active in the mask.
     */
    function hasBuff(uint256 _mask, uint256 _tribeId) internal pure returns (bool) {
        return (_mask & (1 << _tribeId)) != 0;
    }

    /**
     * @notice Performs a genetic crossover (Bitwise manipulation) for Gen-2 descendants.
     * @dev DNA synthesis is filtered through the adversaryBuffer (Phase 9 Convergence).
     */
    function crossover(
        uint256 _g1, 
        uint256 _g2, 
        uint256 _seed, 
        uint256 _adversaryBuffer
    ) internal pure returns (uint256) {
        uint256 mask = 0xFFFFFFFF00000000FFFFFFFF00000000FFFFFFFF00000000FFFFFFFF0000;
        uint256 mixed = (_g1 & mask) | (_g2 & ~mask);
        // Synthesis filtered through adversaryBuffer
        uint256 noise = uint256(keccak256(abi.encodePacked(_seed, _adversaryBuffer)));
        return mixed ^ (noise & 0x0000FFFF0000FFFF0000FFFF0000FFFF);
    }

    /**
     * @notice Legacy Lesson Buffer: Failure encoded as ancestral wisdom.
     * @dev Formula: UP = (ForgeFailure * MindJitter) / 13
     *      Bounds: ForgeFailure (15-22%), MindJitter (1-65%)
     */
    function calculateAncestralWisdom(uint256 _forgeFailure, uint256 _mindJitter) internal pure returns (uint256) {
        uint256 failure = _forgeFailure;
        if (failure < 15) failure = 15;
        if (failure > 22) failure = 22;

        uint256 jitter = _mindJitter;
        if (jitter < 1) jitter = 1;
        if (jitter > 65) jitter = 65;

        return (failure * jitter) / 13;
    }
}
