// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { LibAppStorage, AppStorage, TilePhysics } from "../libraries/LibAppStorage.sol";

/**
 * @title ResonanceFacet
 * @notice Handles Match-3 resonance recording and evolutionary physics.
 */
contract ResonanceFacet {
    event ResonanceAscended(address indexed player, uint256 bunnyId, uint256 newResonance);

    /**
     * @notice Records the results of a Match-3 session.
     * @param _bunnyId The ID of the bunny involved.
     * @param _score The resonance score achieved.
     * @param _duration The duration of the session.
     */
    function recordResonance(uint256 _bunnyId, uint256 _score, uint256 _duration) external {
        AppStorage storage ds = LibAppStorage.diamondStorage();
        require(ds.bunnyIndexToOwner[_bunnyId] == msg.sender, "Auditor: Not your bunny");

        // Evolutionary logic: Resonance scales with performance
        // Base gain: 1 point per 1000 score
        uint256 resonanceGain = _score / 1000;
        ds.bunnies[_bunnyId].resonance += resonanceGain;

        emit ResonanceAscended(msg.sender, _bunnyId, ds.bunnies[_bunnyId].resonance);
    }

    /**
     * @notice Updates the 'Mind Sync' physics for a bunny.
     * @param _bunnyId The ID of the bunny.
     * @param _x X coordinate in the grid.
     * @param _y Y coordinate in the grid.
     * @param _isFloating Floating state (influenced by Antigravity).
     */
    function updateEntityPhysics(uint256 _bunnyId, int256 _x, int256 _y, bool _isFloating) external {
        AppStorage storage ds = LibAppStorage.diamondStorage();
        require(ds.bunnyIndexToOwner[_bunnyId] == msg.sender, "Auditor: Not your entity");

        ds.bunnyPhysics[_bunnyId] = TilePhysics({
            x: _x,
            y: _y,
            velocityY: 0,
            isFloating: _isFloating
        });
    }

    function getEntityPhysics(uint256 _bunnyId) external view returns (TilePhysics memory) {
        AppStorage storage ds = LibAppStorage.diamondStorage();
        return ds.bunnyPhysics[_bunnyId];
    }
}
