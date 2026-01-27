// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { LibAppStorage, AppStorage } from "./libraries/LibAppStorage.sol";

contract Diamond {
    mapping(bytes4 => address) selectorToFacet;

    constructor(address _contractOwner) {
        AppStorage storage ds = LibAppStorage.diamondStorage();
        ds.contractOwner = _contractOwner;
    }

    // --- The Batch Ritual ---
    // Allows linking multiple functions to a facet in one transaction
    function setFacetsBatch(bytes4[] calldata _selectors, address _facet) external {
        // In the future, we will add: require(msg.sender == ds.contractOwner);
        for (uint i = 0; i < _selectors.length; i++) {
            selectorToFacet[_selectors[i]] = _facet;
        }
    }

    // Single set for quick fixes
    function setFacet(bytes4 _selector, address _facet) external {
        selectorToFacet[_selector] = _facet;
    }

    // The Prism Logic
    fallback() external payable {
        address facet = selectorToFacet[msg.sig];
        require(facet != address(0), "Diamond: Function does not exist");
        
        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), facet, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())
            switch result
            case 0 { revert(0, returndatasize()) }
            default { return(0, returndatasize()) }
        }
    }

    receive() external payable {}
}