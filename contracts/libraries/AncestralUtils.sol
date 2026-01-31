// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

library AncestralUtils {
    // --- Phase 2 Wisdom: Tribal Buffs ---
    function hasBuff(uint256 mask, uint256 tribeId) internal pure returns (bool) {
        return (mask & (1 << tribeId)) != 0;
    }

    // --- Phase 5 Wisdom: Genetic Decoding ---
    // Genes: [Reserved: 208 bits][Special: 16 bits][Resonance: 16 bits][Tribe: 16 bits]

    function extractTribe(uint256 _genes) internal pure returns (uint16) {
        return uint16(_genes & 0xFFFF);
    }

    function extractResonance(uint256 _genes) internal pure returns (uint16) {
        return uint16((_genes >> 16) & 0xFFFF);
    }

    function hasSynthesisTrait(uint256 _genes) internal pure returns (bool) {
        // Synthesis check at bit 12 (4096)
        return (_genes & 4096) != 0;
    }

    function calculatePowerLevel(uint256 _genes, uint256 _ubuntuPoints) internal pure returns (uint256) {
        uint16 res = extractResonance(_genes);
        // Base power + 10% of the player's current resonance contribution
        return uint256(res) + (_ubuntuPoints / 10);
    }
}
