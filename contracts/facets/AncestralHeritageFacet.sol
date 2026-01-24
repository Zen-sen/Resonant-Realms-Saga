// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { LibAppStorage, AppStorage } from "../libraries/LibAppStorage.sol";

contract AncestralHeritageFacet {
    // Access the shared DNA of the Saga
    function s() internal pure returns (AppStorage storage) {
        return LibAppStorage.diamondStorage();
    }

    event TribeJoined(address indexed player, uint256 tribeId);
    event WisdomShared(address indexed player, uint256 pointsEarned);

    /// @notice Allow a seeker to join one of the ancient tribes
    function joinTribe(uint256 _tribeId) external {
        AppStorage storage ds = s();
        require(ds.playerTribe[msg.sender] == 0, "You already belong to a tribe");
        
        ds.playerTribe[msg.sender] = _tribeId;
        emit TribeJoined(msg.sender, _tribeId);
    }

    /// @notice Earn Ubuntu Points through mentorship or gameplay
    function earnWisdom(uint256 _amount) external {
        AppStorage storage ds = s();
        ds.ubuntuPoints[msg.sender] += _amount;
        
        emit WisdomShared(msg.sender, _amount);
    }

    /// @notice View your current standing in the Saga
    function getPlayerStats(address _player) external view returns (uint256 tribe, uint256 points) {
        AppStorage storage ds = s();
        return (ds.playerTribe[_player], ds.ubuntuPoints[_player]);
    }
}