// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { LibAppStorage, AppStorage, AncestralRelic } from "../libraries/LibAppStorage.sol";
import { LibDiamond } from "../libraries/LibDiamond.sol";

/**
 * @title AncestralRelicFacet
 * @notice Manages special NFT relics tied to tribal heritage.
 * @dev Relics provide power boosts and special abilities in the game.
 */
contract AncestralRelicFacet {
    
    // --- Events ---
    event RelicMinted(
        uint256 indexed relicId,
        address indexed owner,
        uint256 tribeId,
        uint256 rarity
    );
    
    event RelicTransferred(
        uint256 indexed relicId,
        address indexed from,
        address indexed to
    );
    
    event RelicBurned(
        uint256 indexed relicId,
        address indexed owner,
        string reason
    );
    
    event RelicActivated(
        uint256 indexed relicId,
        address indexed owner,
        uint256 powerBoost
    );
    
    event RelicDeactivated(
        uint256 indexed relicId,
        address indexed owner
    );

    // --- Errors ---
    error InvalidTribeId();
    error InvalidRarity();
    error RelicNotFound();
    error NotRelicOwner();
    error RelicAlreadyActive();
    error RelicNotActive();
    error UnauthorizedMinter();
    error MaxRelicsPerTribeReached();

    // --- Constants ---
    uint256 constant MAX_RELICS_PER_TRIBE = 1000;
    uint256 constant MIN_RARITY = 1;
    uint256 constant MAX_RARITY = 5;

    // --- Modifiers ---
    modifier onlyContractOwner() {
        LibDiamond.enforceIsContractOwner();
        _;
    }

    modifier onlyRelicOwner(uint256 _relicId) {
        AppStorage storage s = LibAppStorage.diamondStorage();
        bool isOwner = false;
        uint256[] storage userRelicList = s.userRelics[msg.sender];
        for (uint256 i = 0; i < userRelicList.length; i++) {
            if (userRelicList[i] == _relicId) {
                isOwner = true;
                break;
            }
        }
        if (!isOwner) revert NotRelicOwner();
        _;
    }

    /**
     * @notice Mints a new ancestral relic.
     * @param _to Address to mint to.
     * @param _tribeId Tribe ID (0-12).
     * @param _rarity Rarity level (1-5).
     * @param _metadataURI URI to relic metadata.
     * @return relicId The ID of the newly minted relic.
     */
    function mintRelic(
        address _to,
        uint256 _tribeId,
        uint256 _rarity,
        string calldata _metadataURI
    ) external onlyContractOwner returns (uint256 relicId) {
        if (_tribeId > 12) revert InvalidTribeId();
        if (_rarity < MIN_RARITY || _rarity > MAX_RARITY) revert InvalidRarity();
        
        AppStorage storage s = LibAppStorage.diamondStorage();
        
        // Check tribe relic limit
        if (s.tribeRelicCount[_tribeId] >= MAX_RELICS_PER_TRIBE) {
            revert MaxRelicsPerTribeReached();
        }
        
        // Generate new relic ID
        relicId = s.nextRelicId++;
        
        // Calculate power boost based on rarity
        // Common: 5%, Uncommon: 10%, Rare: 15%, Epic: 20%, Mythic: 30%
        uint256 powerBoost;
        if (_rarity == 1) powerBoost = 5;
        else if (_rarity == 2) powerBoost = 10;
        else if (_rarity == 3) powerBoost = 15;
        else if (_rarity == 4) powerBoost = 20;
        else powerBoost = 30;
        
        // Create relic
        s.relics[relicId] = AncestralRelic({
            relicId: relicId,
            tribeId: _tribeId,
            rarity: _rarity,
            powerBoost: powerBoost,
            metadataURI: _metadataURI,
            isActive: false
        });
        
        // Assign to user
        s.userRelics[_to].push(relicId);
        
        // Update tribe count
        s.tribeRelicCount[_tribeId]++;
        
        emit RelicMinted(relicId, _to, _tribeId, _rarity);
        
        return relicId;
    }

    /**
     * @notice Transfers a relic to another address.
     * @param _relicId Relic ID to transfer.
     * @param _to Address to transfer to.
     */
    function transferRelic(uint256 _relicId, address _to) external onlyRelicOwner(_relicId) {
        AppStorage storage s = LibAppStorage.diamondStorage();
        
        if (s.relics[_relicId].relicId == 0) revert RelicNotFound();
        
        // Deactivate relic before transfer
        if (s.relics[_relicId].isActive) {
            s.relics[_relicId].isActive = false;
            emit RelicDeactivated(_relicId, msg.sender);
        }
        
        // Remove from sender
        uint256[] storage senderRelics = s.userRelics[msg.sender];
        for (uint256 i = 0; i < senderRelics.length; i++) {
            if (senderRelics[i] == _relicId) {
                // Swap with last and pop
                senderRelics[i] = senderRelics[senderRelics.length - 1];
                senderRelics.pop();
                break;
            }
        }
        
        // Add to recipient
        s.userRelics[_to].push(_relicId);
        
        emit RelicTransferred(_relicId, msg.sender, _to);
    }

    /**
     * @notice Burns a relic permanently.
     * @param _relicId Relic ID to burn.
     * @param _reason Reason for burning.
     */
    function burnRelic(uint256 _relicId, string calldata _reason) external onlyRelicOwner(_relicId) {
        AppStorage storage s = LibAppStorage.diamondStorage();
        
        AncestralRelic storage relic = s.relics[_relicId];
        if (relic.relicId == 0) revert RelicNotFound();
        
        uint256 tribeId = relic.tribeId;
        
        // Remove from user
        uint256[] storage userRelicList = s.userRelics[msg.sender];
        for (uint256 i = 0; i < userRelicList.length; i++) {
            if (userRelicList[i] == _relicId) {
                userRelicList[i] = userRelicList[userRelicList.length - 1];
                userRelicList.pop();
                break;
            }
        }
        
        // Update tribe count
        s.tribeRelicCount[tribeId]--;
        
        // Delete relic data
        delete s.relics[_relicId];
        
        emit RelicBurned(_relicId, msg.sender, _reason);
    }

    /**
     * @notice Activates a relic to apply its power boost.
     * @param _relicId Relic ID to activate.
     */
    function activateRelic(uint256 _relicId) external onlyRelicOwner(_relicId) {
        AppStorage storage s = LibAppStorage.diamondStorage();
        
        AncestralRelic storage relic = s.relics[_relicId];
        if (relic.relicId == 0) revert RelicNotFound();
        if (relic.isActive) revert RelicAlreadyActive();
        
        relic.isActive = true;
        
        // Apply power boost to player
        // This could be integrated with other facets for actual stat boosts
        s.playerResonance[msg.sender] += relic.powerBoost;
        
        emit RelicActivated(_relicId, msg.sender, relic.powerBoost);
    }

    /**
     * @notice Deactivates a relic.
     * @param _relicId Relic ID to deactivate.
     */
    function deactivateRelic(uint256 _relicId) external onlyRelicOwner(_relicId) {
        AppStorage storage s = LibAppStorage.diamondStorage();
        
        AncestralRelic storage relic = s.relics[_relicId];
        if (relic.relicId == 0) revert RelicNotFound();
        if (!relic.isActive) revert RelicNotActive();
        
        relic.isActive = false;
        
        // Remove power boost
        s.playerResonance[msg.sender] -= relic.powerBoost;
        
        emit RelicDeactivated(_relicId, msg.sender);
    }

    /**
     * @notice Gets relic details.
     * @param _relicId Relic ID to query.
     * @return Relic struct.
     */
    function getRelic(uint256 _relicId) external view returns (AncestralRelic memory) {
        AppStorage storage s = LibAppStorage.diamondStorage();
        return s.relics[_relicId];
    }

    /**
     * @notice Gets all relic IDs owned by a user.
     * @param _user Address to query.
     * @return Array of relic IDs.
     */
    function getUserRelics(address _user) external view returns (uint256[] memory) {
        AppStorage storage s = LibAppStorage.diamondStorage();
        return s.userRelics[_user];
    }

    /**
     * @notice Gets the count of relics owned by a user.
     * @param _user Address to query.
     * @return Number of relics.
     */
    function getUserRelicCount(address _user) external view returns (uint256) {
        AppStorage storage s = LibAppStorage.diamondStorage();
        return s.userRelics[_user].length;
    }

    /**
     * @notice Gets the count of relics for a specific tribe.
     * @param _tribeId Tribe ID to query.
     * @return Number of relics.
     */
    function getTribeRelicCount(uint256 _tribeId) external view returns (uint256) {
        AppStorage storage s = LibAppStorage.diamondStorage();
        return s.tribeRelicCount[_tribeId];
    }

    /**
     * @notice Batch mint relics (gas efficient).
     * @param _to Array of recipient addresses.
     * @param _tribeIds Array of tribe IDs.
     * @param _rarities Array of rarity levels.
     * @param _metadataURIs Array of metadata URIs.
     * @return Array of minted relic IDs.
     */
    function batchMintRelics(
        address[] calldata _to,
        uint256[] calldata _tribeIds,
        uint256[] calldata _rarities,
        string[] calldata _metadataURIs
    ) external onlyContractOwner returns (uint256[] memory) {
        uint256 batchSize = _to.length;
        
        if (batchSize != _tribeIds.length || batchSize != _rarities.length || batchSize != _metadataURIs.length) {
            revert InvalidTribeId();
        }
        
        uint256[] memory mintedIds = new uint256[](batchSize);
        
        for (uint256 i = 0; i < batchSize; i++) {
            mintedIds[i] = this.mintRelic(_to[i], _tribeIds[i], _rarities[i], _metadataURIs[i]);
        }
        
        return mintedIds;
    }

    /**
     * @notice Gets the total number of relics minted.
     * @return Total relic count.
     */
    function getTotalRelics() external view returns (uint256) {
        AppStorage storage s = LibAppStorage.diamondStorage();
        return s.nextRelicId;
    }
}
