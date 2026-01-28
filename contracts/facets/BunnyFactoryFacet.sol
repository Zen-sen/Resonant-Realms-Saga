// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { LibAppStorage, AppStorage, Bunny } from "../libraries/LibAppStorage.sol";

contract BunnyFactoryFacet {
    event BunnyBorn(uint256 bunnyId, uint256 genes, uint256 matronId, uint256 sireId);

    /**
     * @dev GENESIS MINT: Call this to create the first 0-Gen Ancestors.
     * Only the Diamond Owner can breathe life into the first ancestors.
     */
    function createGenesisBunny(uint256 _genes, address _owner) external {
        AppStorage storage ds = LibAppStorage.diamondStorage();
        
        // Access control via the Diamond Storage
        require(msg.sender == ds.contractOwner, "Not authorized: Only the Sage can mint Genesis");
        
        // Internal call to handle the creation logic
        _createBunny(_genes, 0, 0, 0, _owner);
    }

    /**
     * @dev Internal helper to push the new Bunny into the Hashed Storage Namespace.
     */
    function _createBunny(
        uint256 _genes, 
        uint32 _mId, 
        uint32 _sId, 
        uint16 _gen, 
        address _owner
    ) internal {
        AppStorage storage ds = LibAppStorage.diamondStorage();
        
        Bunny memory _newBunny = Bunny({
            genes: _genes,
            birthTime: uint64(block.timestamp),
            cooldownEndTime: uint64(block.timestamp + 1 days),
            matronId: _mId,
            sireId: _sId,
            generation: _gen
        });

        // Push to the state array in Diamond Storage
        ds.bunnies.push(_newBunny);
        uint256 newId = ds.bunnies.length - 1;

        // Map ownership
        ds.bunnyIndexToOwner[newId] = _owner;
        ds.ownerBunnyCount[_owner]++;

        emit BunnyBorn(newId, _genes, _mId, _sId);
    }
}