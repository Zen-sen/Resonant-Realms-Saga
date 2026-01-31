// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { LibAppStorage, AppStorage, Bunny } from "../libraries/LibAppStorage.sol";
import { AncestralUtils } from "../libraries/AncestralUtils.sol";

contract BunnyFactoryFacet {
    using AncestralUtils for uint256;

    uint256 public constant BASE_MINT_COST = 1000;
    uint256 public constant AWAKENED_THRESHOLD = 1000;

    function mintGenesisBunny() external {
        AppStorage storage ds = LibAppStorage.diamondStorage();
        require(ds.contractOwner == msg.sender, "Only Architect can breath genesis");
        _mint(msg.sender, 0, 0, 0, 0);
    }

    function mintNextGeneration(uint256 _influenceTrait) external {
        AppStorage storage ds = LibAppStorage.diamondStorage();
        uint256 tribeId = ds.playerTribe[msg.sender];
        uint256 currentCost = BASE_MINT_COST;

        if (ds.tribePools[tribeId] >= AWAKENED_THRESHOLD) {
            currentCost = (BASE_MINT_COST * 80) / 100;
        }

        require(ds.playerResonance[msg.sender] >= currentCost, "Insufficient Ubuntu Points");
        ds.playerResonance[msg.sender] -= currentCost;

        // Generate genes and inject the tribal influence
        uint256 randomGenes = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, ds.bunnies.length)));
        uint256 finalGenes = randomGenes | _influenceTrait | tribeId;

        _mint(msg.sender, finalGenes, 0, 0, 1);
    }

    function getBunnyPower(uint256 _id) external view returns (uint256) {
        AppStorage storage ds = LibAppStorage.diamondStorage();
        Bunny memory b = ds.bunnies[_id];
        return b.genes.calculatePowerLevel(ds.playerResonance[ds.bunnyIndexToOwner[_id]]);
    }

    function _mint(address _to, uint256 _genes, uint32 _matronId, uint32 _sireId, uint16 _gen) internal {
        AppStorage storage ds = LibAppStorage.diamondStorage();
        Bunny memory _bunny = Bunny({
            genes: _genes,
            birthTime: block.timestamp,
            cooldownEndTime: 0,
            matronId: _matronId,
            sireId: _sireId,
            generation: _gen
        });
        ds.bunnies.push(_bunny);
        uint256 newBunnyId = ds.bunnies.length - 1;
        ds.bunnyIndexToOwner[newBunnyId] = _to;
        ds.ownerBunnyCount[_to]++;
    }

    function getBunny(uint256 _id) external view returns (Bunny memory) {
        return LibAppStorage.diamondStorage().bunnies[_id];
    }
}
