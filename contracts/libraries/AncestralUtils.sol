// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

library AncestralUtils {
    /// @notice Mixes genes from matron and sire with a hint of randomness
    /// @dev This will be expanded for the Resonant Realms Saga
    function mixGenes(uint256 _mGenes, uint256 _sGenes, uint256 _targetId) internal view returns (uint256) {
        // Philosophical placeholder: The child is more than the sum of the parents
        uint256 randomness = uint256(keccak256(abi.encodePacked(block.timestamp, _targetId)));
        uint256 mixed = (_mGenes & 0xFFFFFFFF00000000) | (_sGenes & 0x00000000FFFFFFFF);
        return mixed ^ (randomness % 100); 
    }
}
