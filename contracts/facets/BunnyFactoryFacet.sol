// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { LibAppStorage, AppStorage, Bunny } from "../libraries/LibAppStorage.sol";

contract BunnyFactoryFacet {
    
    function mintGenesisBunny() external {
        AppStorage storage ds = LibAppStorage.diamondStorage();
        require(ds.contractOwner == msg.sender, "Only Architect can breath genesis");
        _mint(msg.sender, 0, 0, 0, 0);
    }

    /**
     * @notice Mint Bunny #1+ using Ubuntu Points to influence genes
     * @param _influenceTrait The bitwise trait to attempt to bake into the genes
     */
    function mintNextGeneration(uint256 _influenceTrait) external {
        AppStorage storage ds = LibAppStorage.diamondStorage();
        uint256 cost = 1000; 
        require(ds.playerResonance[msg.sender] >= cost, "Insufficient Ubuntu Points");

        ds.playerResonance[msg.sender] -= cost;
        
        // Genes are a mix of randomness and the influenced trait
        uint256 newGenes = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) | _influenceTrait;
        
        _mint(msg.sender, newGenes, 0, 0, 1);
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
