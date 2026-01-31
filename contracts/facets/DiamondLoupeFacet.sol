// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { LibAppStorage, AppStorage } from "../libraries/LibAppStorage.sol";

contract DiamondLoupeFacet {
    struct Facet {
        address facetAddress;
        bytes4[] functionSelectors;
    }

    /// @notice Gets all facets and their selectors.
    function facets() external view returns (Facet[] memory facets_) {
        AppStorage storage ds = LibAppStorage.diamondStorage();
        // This is a simplified version for our custom Diamond
        // In a full implementation, you'd iterate the selector mapping
        // For now, we will return a placeholder or implement full iteration
    }

    /// @notice Gets all function selectors supported by a specific facet.
    function facetFunctionSelectors(address _facet) external view returns (bytes4[] memory facetFunctionSelectors_) {
        // Implementation logic
    }

    /// @notice Gets the facet that supports the given selector.
    function facetAddress(bytes4 _functionSelector) external view returns (address facetAddress_) {
        return LibAppStorage.diamondStorage().selectorToFacet[_functionSelector];
    }
}
