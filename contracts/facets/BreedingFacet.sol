// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { LibAppStorage, AppStorage, Bunny } from "../libraries/LibAppStorage.sol";
import { AncestralUtils } from "../libraries/AncestralUtils.sol";

contract BreedingFacet {
    using AncestralUtils for uint256;

    event BunnyBred(uint256 indexed matronId, uint256 indexed sireId, uint256 childId);

    function breedBunnies(uint256 _matronId, uint256 _sireId) external returns (uint256) {
        AppStorage storage ds = LibAppStorage.diamondStorage();
        
        // Ownership check
        require(ds.bunnyIndexToOwner[_matronId] == msg.sender, "Not your matron");
        require(ds.bunnyIndexToOwner[_sireId] == msg.sender, "Not your sire");

        Bunny storage matron = ds.bunnies[_matronId];
        Bunny storage sire = ds.bunnies[_sireId];

        // Bitwise Crossover (The Soul of the Project)
        uint256 childGenes = (matron.genes & 0xFFFFFFFF00000000) | (sire.genes & 0x00000000FFFFFFFF);
        
        // Add a dash of randomness for mutation
        childGenes ^= uint256(keccak256(abi.encodePacked(block.timestamp, ds.bunnies.length)));

        // Mint the child
        _mintChild(msg.sender, childGenes, uint32(_matronId), uint32(_sireId), matron.generation + 1);
        
        uint256 childId = ds.bunnies.length - 1;
        emit BunnyBred(_matronId, _sireId, childId);
        return childId;
    }

    function _mintChild(address _to, uint256 _genes, uint32 _m, uint32 _s, uint16 _gen) internal {
        AppStorage storage ds = LibAppStorage.diamondStorage();
        ds.bunnies.push(Bunny({
            genes: _genes,
            birthTime: block.timestamp,
            cooldownEndTime: 0,
            matronId: _m,
            sireId: _s,
            generation: _gen
        }));
        uint256 id = ds.bunnies.length - 1;
        ds.bunnyIndexToOwner[id] = _to;
        ds.ownerBunnyCount[_to]++;
    }
}
