// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { LibAppStorage } from "../libraries/LibAppStorage.sol";
import { AncestralUtils } from "../libraries/AncestralUtils.sol";

contract HumanFactoryFacet {
    event HumanBorn(uint256 indexed humanId, uint256 dna, uint256 tribeId);

    function mintHuman(uint256 _tribeId) external {
        // ✅ CORRECT - Use diamondStorage()
        LibAppStorage.AppStorage storage s = LibAppStorage.diamondStorage();
        
        // Add access control
        require(msg.sender == s.allowedMinter, "Not authorized");

        uint256 dna = AncestralUtils.generateGenesisGenes(_tribeId);
        uint256 humanId = s.humanCount;

        s.humans[humanId] = LibAppStorage.Human({
            dna: dna,
            birthTime: block.timestamp,
            tribeId: _tribeId
        });

        // Restore owner tracking
        s.humanIndexToOwner[humanId] = msg.sender;
        s.ownerHumanCount[msg.sender]++;

        s.humanCount++;

        emit HumanBorn(humanId, dna, _tribeId);
    }

    function getHumanCount() external view returns (uint256) {
        return LibAppStorage.diamondStorage().humanCount;
    }

    function getHuman(uint256 _id) external view returns (LibAppStorage.Human memory) {
        return LibAppStorage.diamondStorage().humans[_id];
    }
}