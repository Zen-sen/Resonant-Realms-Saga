// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

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

interface IDiamondCut {
    struct FacetCut {
        address facetAddress;
        uint8 action; // 0=Add, 1=Replace, 2=Remove
        bytes4[] functionSelectors;
    }
    
    function diamondCut(FacetCut[] calldata _diamondCut, address _init, bytes calldata _calldata) external;
}