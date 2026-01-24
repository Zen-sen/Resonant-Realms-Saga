// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { LibAppStorage, AppStorage } from "./libraries/LibAppStorage.sol";

contract Diamond {
    // Storage for function selectors to facet addresses
    mapping(bytes4 => address) selectorToFacet;

    constructor(address _contractOwner) {
        // Explicitly using AppStorage to satisfy the compiler
        AppStorage storage ds = LibAppStorage.diamondStorage();
        ds.contractOwner = _contractOwner;
    }

    // The Diamond Cut: Adding functionality
    function setFacet(bytes4 _selector, address _facet) external {
        // Note: In Jupiter-mode (scaling), we would add an onlyOwner modifier here
        selectorToFacet[_selector] = _facet;
    }

    // The Prism Logic: Delegate calls to facets
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
