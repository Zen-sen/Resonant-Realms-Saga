// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { AppStorage } from "../libraries/LibAppStorage.sol";

contract AncestralHeritageFacet {
    AppStorage internal s;

    event AncestralPulse(uint256 indexed unitId, string resonance);

    /**
     * @dev Mints a Bunny with the bitwise DNA from your React Service.
     * Maps to the 'Function does not exist' selector we hit at Block #88.
     */
    function mintAncestralBunny(
        uint256 _unitId, 
        uint256 _dna, 
        string calldata _resonance,
        string calldata _adversaryBuffer
    ) external {
        // Guard: Only Admin or the Hinge-Sovereign can call Genesis/Mirror mints
        require(msg.sender == s.admin, "Heritage: Only Sovereign can pulse");
        
        // Save to Hashed Storage Namespace
        s.bunnies[_unitId].dna = _dna;
        s.bunnies[_unitId].resonanceSignature = _resonance;
        s.bunnies[_unitId].adversaryBuffer = _adversaryBuffer;
        
        emit AncestralPulse(_unitId, _resonance);
    }

    /**
     * @dev Retrieves the Duality status
     */
    function getDualityStatus(uint256 _unitId) external view returns (bool isHinge) {
        // Bit 250 is our Foundation Marker from your calculateMirrorLinkageDNA logic
        return (s.bunnies[_unitId].dna >> 250) & 1 == 1;
    }
}