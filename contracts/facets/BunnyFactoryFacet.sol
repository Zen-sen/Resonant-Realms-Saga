// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { LibAppStorage, AppStorage, Bunny } from "../libraries/LibAppStorage.sol";
import { AncestralUtils } from "../libraries/AncestralUtils.sol";

contract BunnyFactoryFacet {
    event BunnyBorn(uint256 bunnyId, uint256 genes, uint256 matronId, uint256 sireId);

    function breedBunnies(uint32 _matronId, uint32 _sireId) external {
        AppStorage storage ds = LibAppStorage.diamondStorage();
        
        require(ds.bunnyIndexToOwner[_matronId] == msg.sender, "Not the matron owner");
        require(block.timestamp >= ds.bunnies[_matronId].cooldownEndTime, "Breeding cooldown active");

        // Using the Ancestral Wisdom to mix genes
        uint256 newGenes = AncestralUtils.mixGenes(
            ds.bunnies[_matronId].genes, 
            ds.bunnies[_sireId].genes, 
            ds.totalBunnies
        );
        
        _createBunny(newGenes, _matronId, _sireId, ds.bunnies[_matronId].generation + 1, msg.sender);
    }

    function _createBunny(
        uint256 _genes,
        uint32 _matronId,
        uint32 _sireId,
        uint16 _generation,
        address _owner
    ) internal {
        AppStorage storage ds = LibAppStorage.diamondStorage();
        
        Bunny memory _bunny = Bunny({
            genes: _genes,
            birthTime: uint64(block.timestamp),
            cooldownEndTime: uint64(block.timestamp + 1 days),
            matronId: _matronId,
            sireId: _sireId,
            generation: _generation
        });

        ds.bunnies.push(_bunny);
        uint256 newBunnyId = ds.bunnies.length - 1;
        
        ds.bunnyIndexToOwner[newBunnyId] = _owner;
        ds.totalBunnies++;

        emit BunnyBorn(newBunnyId, _genes, _matronId, _sireId);
    }
}
