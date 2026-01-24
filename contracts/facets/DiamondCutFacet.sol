// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { IDiamondCut } from "../interfaces/IDiamondCut.sol";
import { LibDiamond } from "../libraries/LibDiamond.sol";

contract DiamondCutFacet is IDiamondCut {
    // Standard Diamond Cut function
    /// @notice Add/replace/remove any number of functions and optionally execute a function with delegatecall
    /// @param _diamondCut Contains the facet addresses and function selectors
    /// @param _init The address of the contract or facet to execute _calldata
    /// @param _calldata A function call, including function selector and arguments                  
    function diamondCut(
        FacetCut[] calldata _diamondCut,
        address _init,
        bytes calldata _calldata
    ) external override {
        // Here we would normally check for ownership
        // LibDiamond.enforceIsContractOwner(); 
        
        // This is a simplified version for our initial forge
        
        
        for (uint256 facetIndex; facetIndex < _diamondCut.length; facetIndex++) {
            IDiamondCut.FacetCutAction action = _diamondCut[facetIndex].action;
            if (action == IDiamondCut.FacetCutAction.Add) {
                addFunctions(_diamondCut[facetIndex].facetAddress, _diamondCut[facetIndex].functionSelectors);
            }
            // Logic for Replace and Remove would follow for a full EIP-2535 implementation
        }
        
        emit DiamondCut(_diamondCut, _init, _calldata);
    }

    function addFunctions(address _facetAddress, bytes4[] memory _functionSelectors) internal {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        for (uint256 selectorIndex; selectorIndex < _functionSelectors.length; selectorIndex++) {
            bytes4 selector = _functionSelectors[selectorIndex];
            ds.selectorToFacetAndPosition[selector] = LibDiamond.FacetAddressAndPosition({
                facetAddress: _facetAddress,
                functionSelectorPosition: uint96(ds.facetFunctionSelectors[_facetAddress].length)
            });
            ds.facetFunctionSelectors[_facetAddress].push(selector);
        }
    }
}
