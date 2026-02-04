// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

library AncestralUtils {
    // Decoding bits: 
    // [Lineage: 128][Skin: 16][Facial: 16][Markings: 16][Ancestry: 48][Resonance: 16][Tribe: 16]
    
    function extractTribe(uint256 _genes) internal pure returns (uint16) {
        return uint16(_genes & 0xFFFF);
    }

    function extractResonance(uint256 _genes) internal pure returns (uint16) {
        return uint16((_genes >> 16) & 0xFFFF);
    }

    /**
     * @dev Extracts the Skin Tone index (0-255). 
     * This allows the frontend to map to a specific melanin hex code.
     */
    function extractSkinTone(uint256 _genes) internal pure returns (uint8) {
        return uint8((_genes >> 80) & 0xFF);
    }

    function generateGenesisGenes(uint256 _tribeId) internal view returns (uint256) {
        uint256 resonance = 100;
        // Generate random traits for the Human avatar
        uint256 randomPart = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, block.prevrandao)));
        
        // Clean the lower 32 bits to make room for Resonance and Tribe
        return (randomPart & ~uint256(0xFFFFFFFF)) | (resonance << 16) | _tribeId;
    }

    function hasBuff(uint256 _mask, uint256 _buffIndex) internal pure returns (bool) {
        return (_mask & (1 << _buffIndex)) != 0;
    }

    function getTribalBuff(uint16 _tribeId) internal pure returns (string memory) {
        if (_tribeId == 0) return "Ancestral Memory: +10% Crit Match"; // Khoe-San foundation
        if (_tribeId >= 1 && _tribeId <= 10) return "Cultural Heritage: +5% Resonance Gain";
        if (_tribeId == 11) return "The Balanced Bridge: Synthesis Mode"; // The Synthesis / Integration Layer
        return "Universal Ubuntu: Standard Balance";
    }
}