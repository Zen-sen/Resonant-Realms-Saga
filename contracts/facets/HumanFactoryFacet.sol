// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { LibAppStorage, AppStorage, Bunny, Human } from "../libraries/LibAppStorage.sol";

contract HumanFactoryFacet {
    event HumanAwakened(uint256 indexed bunnyId, uint256 indexed humanId, address owner);

    function awakenHuman(uint256 _bunnyId) external {
        AppStorage storage s = LibAppStorage.diamondStorage();
        
        require(s.bunnyIndexToOwner[_bunnyId] == msg.sender, "Auditor: Not your Bunny");
        Bunny storage targetBunny = s.bunnies[_bunnyId];
        
        require(targetBunny.resonance >= 100, "Inadequate Resonance for awakening");

        uint256 newHumanId = s.humanCount;

        s.humans[newHumanId] = Human({
            dna: targetBunny.genes ^ uint256(keccak256(abi.encodePacked("AWAKEN", block.timestamp))),
            awakenedTime: block.timestamp,
            tribeId: targetBunny.tribeId,
            level: 1,
            ubuntuPower: targetBunny.resonance
        });

        s.humanIndexToOwner[newHumanId] = msg.sender;
        s.humanCount++;

        delete s.bunnyIndexToOwner[_bunnyId];

        emit HumanAwakened(_bunnyId, newHumanId, msg.sender);
    }
}
