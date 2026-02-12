// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/**
 * @title GravityFacet
 * @notice Manages the physical state and anti-gravity logic for the Resonant Realms.
 * @dev Part of the Diamond Standard (EIP-2535) architecture.
 */

import { LibAppStorage, AppStorage, TilePhysics } from "../libraries/LibAppStorage.sol";
import { GravityConstants } from "../universal-logic/GravityConstants.sol";

contract GravityFacet {
    
    /**
     * @notice Initializes the physical properties of a tribe.
     * @dev Connects the Universal Logic constants to the Diamond Storage.
     * @param _tribeId The ID of the tribe (0 = Khoe-San, 12 = Coloured/Bridge).
     */
    function syncTribePhysics(uint256 _tribeId) external {
        AppStorage storage ds = LibAppStorage.diamondStorage();
        GravityConstants.PhysicsProfile memory profile = GravityConstants.getProfile(_tribeId);
        
        ds.tribes[_tribeId].mass = profile.mass;
        ds.tribes[_tribeId].buoyancy = profile.buoyancy;
    }

    /**
     * @notice Updates the blockchain with physics data calculated in the Mind (Node.js).
     * @dev Syncs coordinates and floating states after a Google Gravity collapse.
     * @param _bunnyId The ID of the Sage/Bunny.
     * @param _x The horizontal coordinate.
     * @param _y The vertical coordinate.
     * @param _floating True if the tile is resisting gravity (The Bridge advantage).
     */
    function updatePhysicalState(
        uint256 _bunnyId, 
        int256 _x, 
        int256 _y, 
        bool _floating
    ) external {
        AppStorage storage ds = LibAppStorage.diamondStorage();
        
        // Ensure the Sage exists before recording physics
        require(_bunnyId < ds.bunnyCount, "GravityFacet: Sage does not exist");

        ds.bunnyPhysics[_bunnyId] = TilePhysics({
            x: _x,
            y: _y,
            velocityY: 0, 
            isFloating: _floating
        });
    }

    /**
     * @notice Batch update for multiple tiles simultaneously.
     * @dev Used for large Match-3 chain reactions.
     */
    function batchUpdatePhysics(
        uint256[] calldata _ids, 
        int256[] calldata _xCoords, 
        int256[] calldata _yCoords, 
        bool[] calldata _floatingStates
    ) external {
        AppStorage storage ds = LibAppStorage.diamondStorage();
        require(_ids.length == _xCoords.length, "GravityFacet: Input mismatch");

        for (uint256 i = 0; i < _ids.length; i++) {
            ds.bunnyPhysics[_ids[i]] = TilePhysics({
                x: _xCoords[i],
                y: _yCoords[i],
                velocityY: 0,
                isFloating: _floatingStates[i]
            });
        }
    }

    /**
     * @notice Returns the current physical state of a Sage.
     */
    function getPhysicalState(uint256 _bunnyId) external view returns (TilePhysics memory) {
        return LibAppStorage.diamondStorage().bunnyPhysics[_bunnyId];
    }
}