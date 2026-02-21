// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { LibAppStorage, AppStorage, Bunny, Human } from "../libraries/LibAppStorage.sol";
import { AncestralUtils } from "../libraries/AncestralUtils.sol";

contract HumanFactoryFacet {
    event HumanAwakened(uint256 indexed bunnyId, uint256 indexed humanId, address owner);
    event EmergencyRelief(address indexed player, uint256 timestamp);

    /**
     * @notice The Great Awakening: Transcending from Bunny to Human.
     * @dev Enforces 10,000 UP threshold and Bit 0 preservation.
     */
    function awakenHuman(uint256 _bunnyId) external {
        AppStorage storage s = LibAppStorage.diamondStorage();
        
        // 1. Ownership & Resonance Check
        require(s.bunnyIndexToOwner[_bunnyId] == msg.sender, "Auditor: Not your Bunny");
        Bunny storage targetBunny = s.bunnies[_bunnyId];
        require(targetBunny.resonance >= 100, "Inadequate Resonance for awakening");

        // 2. Ubuntu Points Threshold (10,000 UP required for transcendence)
        require(s.playerResonance[msg.sender] >= 10000, "Ubuntu: 10,000 UP required for Transcendence");

        // 3. Resonance Validation (44Hz or 88Hz)
        // Note: In our system, resonance values are mapped to frequencies.
        // 100 Resonance = 44Hz (Root), 200 Resonance = 88Hz (Unity).
        require(targetBunny.resonance == 100 || targetBunny.resonance == 200, "Resonance: Must align with 44Hz or 88Hz");

        uint256 newHumanId = s.humanCount;

        // 4. Bit 0 Preservation via FORCE_MASK
        // We ensure the foundation bit is inherited exactly from the bunny.
        uint256 entropy = uint256(keccak256(abi.encodePacked("AWAKEN", block.timestamp, msg.sender)));
        uint256 maskedGenes = (targetBunny.genes & 1) | ((targetBunny.genes ^ entropy) & AncestralUtils.FORCE_MASK);

        s.humans[newHumanId] = Human({
            dna: maskedGenes,
            awakenedTime: block.timestamp,
            tribeId: targetBunny.tribeId,
            level: 1,
            ubuntuPower: targetBunny.resonance
        });

        // Double check Bit 0 integrity
        if ((targetBunny.genes & 1) == 1) {
            require((s.humans[newHumanId].dna & 1) == (targetBunny.genes & 1), "Genetic Drift: Bit 0 corruption detected!");
        }

        s.humanIndexToOwner[newHumanId] = msg.sender;
        s.humanCount++;

        // Burn the bunny index (Transcendence)
        delete s.bunnyIndexToOwner[_bunnyId];

        emit HumanAwakened(_bunnyId, newHumanId, msg.sender);
    }

    /**
     * @notice Emergency Repair function to secure Bit 0 in extreme drift cases.
     */
    function emergencyFoundationRepair() external {
        AppStorage storage s = LibAppStorage.diamondStorage();
        require(s.playerTribe[msg.sender] == 0, "Only Tribe 0 can initiate emergency repair");
        
        // Repair the player's buff mask if Bit 0 was lost
        if ((s.playerBuffs[msg.sender] & 1) == 0) {
            s.playerBuffs[msg.sender] |= 1;
            emit EmergencyRelief(msg.sender, block.timestamp);
        }
    }

    /**
     * @notice Returns the requirements for a specific tribe's path to 88Hz Sovereign.
     */
    function getAwakeningPath(uint256 _tribeId) external pure returns (uint256 baseFreq, uint256 boostNeeded) {
        if (_tribeId == 4) return (45, 43); // Setswana
        if (_tribeId == 5) return (38, 50); // Sepedi
        return (44, 0);
    }
}
