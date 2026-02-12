// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { LibAppStorage, AppStorage, Bunny } from "../libraries/LibAppStorage.sol";

contract BunnyFactoryFacet {
    event SageBreathed(uint256 indexed bunnyId, uint256 tribeId, uint256 genes);

    function breatheSage(uint256 _genes, uint256 _tribeId) external {
        AppStorage storage ds = LibAppStorage.diamondStorage();
        uint256 newId = ds.bunnyCount;

        // Matching your 8-field Bunny struct exactly from LibAppStorage
        ds.bunnies[newId] = Bunny({
            genes: _genes,
            birthTime: block.timestamp,
            tribeId: _tribeId,
            generation: 0,
            resonance: 0,
            matronId: 0,
            sireId: 0,
            cooldownEnd: 0
        });

        ds.bunnyCount++;
        emit SageBreathed(newId, _tribeId, _genes);
    }

    function totalSages() external view returns (uint256) {
        return LibAppStorage.diamondStorage().bunnyCount;
    }

    function getSage(uint256 _bunnyId) external view returns (Bunny memory) {
        return LibAppStorage.diamondStorage().bunnies[_bunnyId];
    }
}
