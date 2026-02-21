// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { LibAppStorage, AppStorage, Bunny } from "../libraries/LibAppStorage.sol";

contract UbuntuPointsFacet {
    /**
     * @notice Calculates the foundation discount for breeding.
     * @dev Rule: If the lineage preserves Bit 0 (Khoe-San Foundation), apply a 200 UP discount.
     * @param _genes Genes of the ancestor being checked.
     * @return discount Potential discount amount.
     */
    function calculateFoundationDiscount(uint256 _genes) external pure returns (uint256) {
        // Rule: if (Bunny.gene[0] == 1) applyDiscount(200);
        if ((_genes & 1) == 1) {
            return 200;
        }
        return 0;
    }

    /**
     * @notice Checks if the current lineage (matron and sire) qualifies for the Foundation Discount.
     * @param _matronId ID of the matron.
     * @param _sireId ID of the sire.
     * @return bool True if both parents carry the Foundation Bit.
     */
    function qualifyForFoundationDiscount(uint256 _matronId, uint256 _sireId) external view returns (bool) {
        AppStorage storage ds = LibAppStorage.diamondStorage();
        uint256 matronGenes = ds.bunnies[_matronId].genes;
        uint256 sireGenes = ds.bunnies[_sireId].genes;
        
        return (matronGenes & 1) == 1 && (sireGenes & 1) == 1;
    }
}
