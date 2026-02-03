// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

library AncestralUtils {
    // Decoding bits: [Tribe: 16 bits][Resonance: 16 bits][Random: 224 bits]
    function extractTribe(uint256 _genes) internal pure returns (uint16) {
        return uint16(_genes & 0xFFFF);
    }

    function extractResonance(uint256 _genes) internal pure returns (uint16) {
        return uint16((_genes >> 16) & 0xFFFF);
    }

    function generateGenesisGenes(uint256 _tribeId) internal view returns (uint256) {
        uint256 resonance = 100;
        uint256 randomPart = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) >> 32;
        return (randomPart << 32) | (resonance << 16) | _tribeId;
    }

    // Restore the function MentorshipFacet is looking for
    function hasBuff(uint256 _mask, uint256 _buffIndex) internal pure returns (bool) {
        return (_mask & (1 << _buffIndex)) != 0;
    }

    // Keep our new Tribal Wisdom Gate
    function getTribalBuff(uint16 _tribeId) internal pure returns (string memory) {
        if (_tribeId == 0) return "Ancestral Memory: +10% Crit Match";
        if (_tribeId >= 1 && _tribeId <= 4) return "Warrior Spirit: +5% Resonance Gain";
        if (_tribeId == 12) return "The Balanced Bridge: Synthesis Mode";
        return "Universal Ubuntu: Standard Balance";
    }
}
