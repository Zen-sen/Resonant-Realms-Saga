// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {LibAppStorage, AppStorage, Bunny} from "../../contracts/libraries/LibAppStorage.sol";

contract BunnyFactoryFacet {
    using LibAppStorage for AppStorage;

    uint256 constant MINT_FEE = 0.001 ether;
    uint256 constant DNA_DIGITS = 16;
    uint256 constant DNA_MODULUS = 10 ** DNA_DIGITS;

    event BunnyMinted(
        uint256 indexed bunnyId,
        uint256 genes,
        uint256 tribeId,
        address minter,
        uint256 timestamp
    );

    error InsufficientOfferings();
    error InvalidTribe();

    function mintGenesis() external payable returns (uint256) {
        AppStorage storage s = LibAppStorage.diamondStorage();
        
        if (msg.value < MINT_FEE) revert InsufficientOfferings();

        uint256 bunnyId = s.bunnyCount;
        
        uint256 genes = _generateGeneHash(bunnyId, msg.sender, block.timestamp);
        uint256 tribeId = _assignTribe(genes);

        s.bunnies[bunnyId] = Bunny({
            genes: genes,
            birthTime: block.timestamp,
            tribeId: tribeId,
            generation: 0,
            resonance: 0,
            matronId: 0,
            sireId: 0,
            cooldownEnd: 0
        });

        s.bunnyIndexToOwner[bunnyId] = msg.sender;
        s.bunnyCount++;

        emit BunnyMinted(bunnyId, genes, tribeId, msg.sender, block.timestamp);
        return bunnyId;
    }

    function _generateGeneHash(uint256 id, address minter, uint256 timestamp) 
        internal 
        pure 
        returns (uint256) 
    {
        uint256 hash = uint256(keccak256(abi.encodePacked(id, minter, timestamp)));
        return hash % DNA_MODULUS;
    }

    function _assignTribe(uint256 genes) 
        internal 
        pure 
        returns (uint256) 
    {
        uint256 roll = genes % 100;
        
        if (roll < 70) return 0; // Khoe-San: The Root
        if (roll < 90) return 1; // amaZulu: The Pulse
        return 2;                // Coloured: The Bridge
    }

    function getBunny(uint256 bunnyId) external view returns (Bunny memory) {
        return LibAppStorage.diamondStorage().bunnies[bunnyId];
    }

    function getTotalSupply() external view returns (uint256) {
        return LibAppStorage.diamondStorage().bunnyCount;
    }

    function getBunnyOwner(uint256 bunnyId) external view returns (address) {
        return LibAppStorage.diamondStorage().bunnyIndexToOwner[bunnyId];
    }
}
