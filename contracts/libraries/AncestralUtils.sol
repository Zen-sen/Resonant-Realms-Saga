// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

library AncestralUtils {
    struct PhysicsProfile {
        int256 mass;
        int256 buoyancy;
    }

    uint256 constant FORCE_MASK = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFE;

    // ═══════════════════════════════════════════════════════
    //  TRIBAL PHYSICS PROFILES (0-12)
    // ═══════════════════════════════════════════════════════

    /**
     * @notice Zulu (1): Lightning Mass - High stability, Thunder's weight.
     */
    function zuluConstants() internal pure returns (PhysicsProfile memory) {
        return PhysicsProfile(180, 20);
    }

    /**
     * @notice Xhosa (2): Resonance Buoyancy - River flow, ancestral current.
     */
    function xhosaConstants() internal pure returns (PhysicsProfile memory) {
        return PhysicsProfile(80, 60);
    }

    /**
     * @notice Sotho (3): Steadfast Bridge - Mountain endurance, balanced stance.
     */
    function sothoConstants() internal pure returns (PhysicsProfile memory) {
        return PhysicsProfile(100, 30);
    }

    /**
     * @notice Setswana (4): Diplomatic Balance - Rain-caller's equilibrium.
     */
    function setswanaConstants() internal pure returns (PhysicsProfile memory) {
        return PhysicsProfile(100, 30);
    }

    /**
     * @notice Sepedi (5): Regenerative Healer - Light mass, high buoyancy.
     */
    function sepediConstants() internal pure returns (PhysicsProfile memory) {
        return PhysicsProfile(50, 90);
    }

    /**
     * @notice Xitsonga (6): Xibelani Spin - Balanced centrifugal force.
     */
    function xitsongaConstants() internal pure returns (PhysicsProfile memory) {
        return PhysicsProfile(100, 50);
    }

    /**
     * @notice Swati (7): Ceremonial Dancer - Reed dance agility, moderate lift.
     */
    function swatiConstants() internal pure returns (PhysicsProfile memory) {
        return PhysicsProfile(90, 40);
    }

    /**
     * @notice Venda (8): Mystic Anchor - Lake of Fundudzi depth, grounded mystic.
     */
    function vendaConstants() internal pure returns (PhysicsProfile memory) {
        return PhysicsProfile(120, 35);
    }

    /**
     * @notice isiNdebele (9): Symmetric Harmony - Geometric precision, balanced forces.
     */
    function ndebeleConstants() internal pure returns (PhysicsProfile memory) {
        return PhysicsProfile(90, 50);
    }

    /**
     * @notice Tsonga (10): Coastal Drift - Ocean influence, moderate buoyancy.
     */
    function tsongaConstants() internal pure returns (PhysicsProfile memory) {
        return PhysicsProfile(85, 55);
    }

    /**
     * @notice Afrikaans (11): Frontier Forge - Settler resilience, heavy build.
     */
    function afrikaansConstants() internal pure returns (PhysicsProfile memory) {
        return PhysicsProfile(130, 25);
    }

    // ═══════════════════════════════════════════════════════
    //  RESONANCE & GENETIC LOGIC
    // ═══════════════════════════════════════════════════════

    /**
     * @notice Calculates the resonance cascade bonus for Tribe 6 (Xitsonga).
     * @dev 5+ circular matches trigger a +25% bonus.
     */
    function calculateResonanceCascade(uint256 _matches, uint256 _duration) internal pure returns (uint256) {
        if (_matches < 5) return 0;
        
        // Base resonance simulation: matches * 10 + duration / 2
        uint256 baseRes = (_matches * 10) + (_duration / 2);
        return (baseRes * 25) / 100; // 25% Bonus
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
        // Synthesis filtered through adversaryBuffer and FORCE_MASK (Bit 0 protection)
        uint256 noise = uint256(keccak256(abi.encodePacked(_seed, _adversaryBuffer)));
        uint256 repetitionMask = 0x0000FFFE0000FFFE0000FFFE0000FFFE;
        return mixed ^ (noise & repetitionMask & FORCE_MASK);
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
