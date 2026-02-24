// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/**
 * @title Universal Logic: UL-SECURE-OWNER-01
 * @notice Diamond Standard Ownership Enforcement Pattern
 * @dev Part of the Resonant Realms Saga v1.4.1 - The Balanced Bridge Architecture
 * 
 * Logic Purpose: 
 * Implements the "Architect's Seal" - a critical security pattern for the Diamond Standard.
 * Ensures only the contract owner (the Architect) can perform diamondCut operations.
 * This prevents unauthorized facet injection, protecting the ǃKaggen (Bunny #0) 
 * Genesis Breathing Test and all tribal logic.
 * 
 * The Pulse (Genesis Breathing Test Impact):
 * - Without this: ANY address could call diamondCut and inject malicious facets
 * - With this: Only the deployed Architect (contractOwner) can modify the Diamond Stone
 * - Result: Bunny #0 minting via SageOf remains secure and uncorrupted
 */

library LibDiamond {
    bytes32 constant DIAMOND_STORAGE_POSITION = keccak256("diamond.standard.diamond.storage");

    struct FacetAddressAndPosition {
        address facetAddress;
        uint96 functionSelectorPosition; 
    }

    struct DiamondStorage {
        mapping(bytes4 => FacetAddressAndPosition) selectorToFacetAndPosition;
        mapping(address => bytes4[]) facetFunctionSelectors;
        address[] facetAddresses;
        address contractOwner;
    }

    function diamondStorage() internal pure returns (DiamondStorage storage ds) {
        bytes32 position = DIAMOND_STORAGE_POSITION;
        assembly {
            ds.slot := position
        }
    }

    /**
     * @notice The Architect's Seal - Ownership Enforcement
     * @dev Reverts if msg.sender is not the contract owner
     * @custom:security CRITICAL - Must be called at the start of diamondCut
     */
    function enforceIsContractOwner() internal view {
        require(
            msg.sender == diamondStorage().contractOwner, 
            "LibDiamond: Must be contract owner"
        );
    }

    /**
     * @notice Sets a new contract owner
     * @param _newOwner The address of the new owner
     * @dev Only callable by current owner through a facet
     */
    function setContractOwner(address _newOwner) internal {
        DiamondStorage storage ds = diamondStorage();
        ds.contractOwner = _newOwner;
    }
}
