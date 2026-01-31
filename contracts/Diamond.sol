// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { LibAppStorage, AppStorage } from "./libraries/LibAppStorage.sol";

/**
 * @title The Resonant Stone (Diamond Proxy)
 * @notice Simplified Diamond pattern using the setFacetsBatch "Architect" method.
 */
contract Diamond {
    constructor(address _owner) {
        AppStorage storage ds = LibAppStorage.diamondStorage();
        ds.contractOwner = _owner;
    }

    /**
     * @notice The Architect's Inscription method.
     * @dev Maps multiple function selectors to a single logic facet.
     */
    function setFacetsBatch(address _facet, bytes4[] calldata _selectors) external {
        AppStorage storage ds = LibAppStorage.diamondStorage();
        require(msg.sender == ds.contractOwner, "Diamond: Not the Architect");
        require(_facet != address(0), "Diamond: Cannot map to zero address");

        for (uint256 i = 0; i < _selectors.length; i++) {
            ds.selectorToFacet[_selectors[i]] = _facet;
        }
    }

    /**
     * @dev Fallback function delegates execution to the mapped facet.
     */
    fallback() external payable {
        AppStorage storage ds = LibAppStorage.diamondStorage();
        address facet = ds.selectorToFacet[msg.sig];
        
        if (facet == address(0)) {
            revert("Diamond: Function does not exist");
        }

        assembly {
            // Copy calldata to memory
            calldatacopy(0, 0, calldatasize())
            // Delegate call to the facet
            let result := delegatecall(gas(), facet, 0, calldatasize(), 0, 0)
            // Copy return data
            returndatacopy(0, 0, returndatasize())
            // Handle the result
            switch result
            case 0 { revert(0, returndatasize()) }
            default { return(0, returndatasize()) }
        }
    }

    receive() external payable {}
}