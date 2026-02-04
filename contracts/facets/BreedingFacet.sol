// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { LibAppStorage, AppStorage, Human } from "../libraries/LibAppStorage.sol";

contract BreedingFacet {
    function breed(uint256 _matronId, uint256 _sireId) external {
        AppStorage storage ds = LibAppStorage.diamondStorage();
        
        require(ds.bunnyIndexToOwner[_matronId] == msg.sender, "Not your matron");
        require(ds.bunnyIndexToOwner[_sireId] == msg.sender, "Not your sire");
        
        Human storage matron = ds.bunnies[_matronId];
        Human storage sire = ds.bunnies[_sireId];

        // Genetic Crossover logic
        uint256 childGenes = (matron.genes & 0xFFFFFFFF00000000) | (sire.genes & 0x00000000FFFFFFFF);
        childGenes ^= uint256(keccak256(abi.encodePacked(block.timestamp, ds.bunnyCount)));

        _mintChild(msg.sender, childGenes, uint32(_matronId), uint32(_sireId), matron.generation + 1);
    }

    function _mintChild(
        address _owner, 
        uint256 _genes, 
        uint32 _matronId, 
        uint32 _sireId, 
        uint256 _generation
    ) internal {
        AppStorage storage ds = LibAppStorage.diamondStorage();
        uint256 newId = ds.bunnyCount;
        
        ds.bunnies[newId] = Human({
            genes: _genes,
            birthTime: block.timestamp,
            tribeId: ds.playerTribe[_owner],
            generation: _generation,
            resonance: 50,
            level: 1,
            matronId: uint256(_matronId),
            sireId: uint256(_sireId),
            cooldownEnd: block.timestamp + 1 days
        });

        ds.bunnyIndexToOwner[newId] = _owner;
        ds.ownerHumanCount[_owner]++;
        ds.bunnyCount++;
    }
}
