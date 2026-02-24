// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { LibDiamond } from "../libraries/LibDiamond.sol";

/**
 * @title Universal Logic: UL-DIAMOND-LOUPE-01
 * @notice Diamond Standard Loupe Functions (EIP-2535 Transparency)
 * @dev Part of the Resonant Realms Saga v1.4.1 - The Optical Sensor
 * 
 * Logic Purpose: 
 * Implementation of EIP-2535 Loupe functions. This allows any external entity 
 * (blockchain explorers, frontend dApps, auditors) to query which facets are 
 * active and which function selectors are mapped to them. 
 * 
 * It ensures our Golden Rule of Transparency is technically enforced - 
 * the Diamond Stone becomes a navigable map of ancestral logic rather than a black box.
 * 
 * The Pulse (Genesis Breathing Test Impact):
 * - Without this: The Diamond is opaque - cannot verify which facets are active
 * - With this: Can verify BunnyFactoryFacet, AncestralHeritageFacet, and MentorshipFacet 
 *   are properly registered before minting Bunny #0 (ǃKaggen)
 * - Result: Complete transparency for the SageOf minting ceremony
 */

// Interface for the Loupe
interface IDiamondLoupe {
    struct Facet {
        address facetAddress;
        bytes4[] functionSelectors;
    }
    
    function facets() external view returns (Facet[] memory facets_);
    function facetFunctionSelectors(address _facet) external view returns (bytes4[] memory facetFunctionSelectors_);
    function facetAddresses() external view returns (address[] memory facetAddresses_);
    function facetAddress(bytes4 _functionSelector) external view returns (address facetAddress_);
}

contract DiamondLoupeFacet is IDiamondLoupe {
    
    /**
     * @notice Returns all facets and their function selectors
     * @return facets_ Array of Facet structs containing addresses and selectors
     */
    function facets() external view override returns (Facet[] memory facets_) {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        uint256 numFacets = ds.facetAddresses.length;
        facets_ = new Facet[](numFacets);
        for (uint256 i; i < numFacets; i++) {
            address _facetAddress = ds.facetAddresses[i];
            facets_[i].facetAddress = _facetAddress;
            facets_[i].functionSelectors = ds.facetFunctionSelectors[_facetAddress];
        }
    }


    /**
     * @notice Returns all function selectors for a specific facet
     * @param _facet The facet address to query
     * @return facetFunctionSelectors_ Array of function selectors
     */
    function facetFunctionSelectors(address _facet) external view override returns (bytes4[] memory facetFunctionSelectors_) {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        facetFunctionSelectors_ = ds.facetFunctionSelectors[_facet];
    }

    /**
     * @notice Returns all facet addresses
     * @return facetAddresses_ Array of facet addresses
     */
    function facetAddresses() external view override returns (address[] memory facetAddresses_) {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        facetAddresses_ = ds.facetAddresses;
    }

    /**
     * @notice Returns the facet address that supports a given function selector
     * @param _functionSelector The function selector to query
     * @return facetAddress_ The facet address implementing this function
     */
    function facetAddress(bytes4 _functionSelector) external view override returns (address facetAddress_) {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        facetAddress_ = ds.selectorToFacetAndPosition[_functionSelector].facetAddress;
    }
}
