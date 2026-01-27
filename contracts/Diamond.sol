// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { LibAppStorage, AppStorage } from "./libraries/LibAppStorage.sol";

contract Diamond {
    constructor(address _contractOwner) {
        AppStorage storage ds = LibAppStorage.diamondStorage();
        ds.contractOwner = _contractOwner;
    }

    function setFacetsBatch(bytes4[] calldata _selectors, address _facet) external {
        AppStorage storage ds = LibAppStorage.diamondStorage();
        // SECURITY: Now that ds.contractOwner is set, we can lock this!
        require(msg.sender == ds.contractOwner, "Diamond: Not the Architect");
        
        for (uint i = 0; i < _selectors.length; i++) {
            ds.selectorToFacet[_selectors[i]] = _facet;
        }
    }

    fallback() external payable {
        AppStorage storage ds = LibAppStorage.diamondStorage();
        address facet = ds.selectorToFacet[msg.sig];
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