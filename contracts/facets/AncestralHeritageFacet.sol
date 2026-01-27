// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { LibAppStorage, AppStorage, Tribe } from "../libraries/LibAppStorage.sol";

contract AncestralHeritageFacet {
    function s() internal pure returns (AppStorage storage) {
        return LibAppStorage.diamondStorage();
    }

    event TribeJoined(address indexed player, uint256 tribeId);
    event SynthesisBridgeSet(address indexed player, uint256 targetTribeId);

    function joinTribe(uint256 _tribeId) external {
        AppStorage storage ds = s();
        require(!ds.hasChosenTribe[msg.sender], "Already belong to a tribe");
        ds.playerTribe[msg.sender] = _tribeId;
        ds.hasChosenTribe[msg.sender] = true;
        emit TribeJoined(msg.sender, _tribeId);
    }

    function selectSynthesisBridge(uint256 _targetTribeID) external {
        AppStorage storage ds = s();
        require(ds.playerTribe[msg.sender] == 11, "Must be Synthesis Tribe");
        require(_targetTribeID <= 10, "Invalid selection");
        ds.synthesisBuff[msg.sender] = _targetTribeID;
        emit SynthesisBridgeSet(msg.sender, _targetTribeID);
    }

    function earnWisdom(uint256 _amount) external {
        AppStorage storage ds = s();
        ds.ubuntuPoints[msg.sender] += _amount;
    }

    function getPlayerStats(address _player) external view returns (uint256 tribe, uint256 points, uint256 activeBuff) {
        AppStorage storage ds = s();
        return (ds.playerTribe[_player], ds.ubuntuPoints[_player], ds.synthesisBuff[_player]);
    }

    function setTribe(uint256 _id, string calldata _name, string calldata _buff) external {
        AppStorage storage ds = s();
        require(msg.sender == ds.contractOwner, "Not the Architect");
        ds.tribes[_id] = Tribe({ name: _name, buff: _buff, isActive: true });
    }
}