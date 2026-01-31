// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "../libraries/LibAppStorage.sol";

contract BunnyFactoryFacet {
    event GenesisMint(address indexed owner, uint256 bunnyId, uint256 genes);

    function mintGenesisBunny(uint256 _genes) external returns (uint256) {
        AppStorage storage ds = LibAppStorage.diamondStorage();
        
        // Only the Stone Sovereign (Owner) can initiate the First Frequency
        require(msg.sender == ds.contractOwner, "Only Sovereign can mint Genesis");

        Bunny memory _bunny = Bunny({
            genes: _genes,
            birthTime: uint64(block.timestamp),
            cooldownEndTime: 0,
            matronId: 0,
            sireId: 0,
            generation: 0
        });

        uint256 newBunnyId = ds.bunnies.length;
        ds.bunnies.push(_bunny);
        ds.bunnyIndexToOwner[newBunnyId] = msg.sender;
        ds.ownerBunnyCount[msg.sender]++;

        emit GenesisMint(msg.sender, newBunnyId, _genes);
        return newBunnyId;
    }

    function getBunny(uint256 _id) external view returns (Bunny memory) {
        return LibAppStorage.diamondStorage().bunnies[_id];
    }
}
