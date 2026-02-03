// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { LibAppStorage, AppStorage, Bunny } from "../libraries/LibAppStorage.sol";

contract BunnyFactoryFacet {
    function mintGenesisBunny(uint256 _tribeId) external {
        AppStorage storage ds = LibAppStorage.diamondStorage();
        uint256 bunnyId = ds.bunnyCount;

        ds.bunnies[bunnyId] = Bunny({
            genes: uint256(keccak256(abi.encodePacked(block.timestamp, bunnyId))),
            birthTime: block.timestamp,
            tribeId: _tribeId,
            generation: 0,
            resonance: 100, // Genesis bonus
            level: 1,
            matronId: 0,
            sireId: 0,
            cooldownEnd: block.timestamp
        });

        ds.bunnyIndexToOwner[bunnyId] = msg.sender;
        ds.ownerBunnyCount[msg.sender]++;
        ds.bunnyCount++;
    }

    function getBunnyCount() external view returns (uint256) {
        return LibAppStorage.diamondStorage().bunnyCount;
    }

    function getBunny(uint256 _id) external view returns (Bunny memory) {
        return LibAppStorage.diamondStorage().bunnies[_id];
    }
}
