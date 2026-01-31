// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { LibAppStorage, AppStorage } from "../libraries/LibAppStorage.sol";

contract AncestralHeritageFacet {
    function mintAncestralBunny(
        uint256 _dna, 
        string calldata _resonance,
        string calldata _adversaryBuffer
    ) external {
        AppStorage storage s = LibAppStorage.diamondStorage();
        
        // Match the naming convention in LibAppStorage: contractOwner
        require(msg.sender == s.contractOwner, "Heritage: Only Sovereign can pulse");
        
        // Logic to push to the bunnies array in storage
        // Note: Using the Bunny struct defined in your LibAppStorage
        s.bunnies.push();
        uint256 newUnitId = s.bunnies.length - 1;
        
        s.bunnies[newUnitId].genes = _dna;
        // We can add additional metadata storage here as we expand the struct
        
        // Emit events or handle resonance mapping
    }

    function getDualityStatus(uint256 _unitId) external view returns (bool isHinge) {
        AppStorage storage s = LibAppStorage.diamondStorage();
        return (s.bunnies[_unitId].genes >> 250) & 1 == 1;
    }
}