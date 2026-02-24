// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { LibAppStorage, AppStorage, Tribe } from "../libraries/LibAppStorage.sol";
import { AncestralUtils } from "../libraries/AncestralUtils.sol";

contract AncestralHeritageFacet {
    event AscensionRitualComplete(address indexed player, uint256 tribeId, uint256 timestamp);

    /**
     * @notice Allows the Architect to configure tribal physics.
     * @param _id Tribe ID (0-12).
     * @param _name Tribe name.
     * @param _mass Gravity influence (-100 to 200).
     * @param _buoyancy Lift influence.
     */
    function setTribe(
        uint256 _id,
        string calldata _name,
        int256 _mass,
        int256 _buoyancy
    ) external {
        AppStorage storage s = LibAppStorage.diamondStorage();
        require(msg.sender == s.contractOwner, "Architect: Unauthorized");
        require(_id < 13, "Invalid tribe ID");

        Tribe storage t = s.tribes[_id];
        t.name = _name;
        t.mass = _mass;
        t.buoyancy = _buoyancy;
        t.isActive = true;
        t.tribeId = _id;
    }

    /**
     * @notice Initializes the base tribal matrix.
     * @dev Only the Architect (Contract Owner) can invoke this.
     */
    function initializeTribalMatrix() external {
        AppStorage storage s = LibAppStorage.diamondStorage();
        require(msg.sender == s.contractOwner, "Architect: Unauthorized");

        // ── Index 0: The Foundation (Khoe-San) ──
        s.tribes[0].name = "Khoe-San";
        s.tribes[0].isActive = true;
        s.tribes[0].mass = 150; // Heavy roots
        s.tribes[0].buoyancy = 0;
        s.tribes[0].tribeId = 0;

        // ── Index 1: Zulu (Lightning Mass) ──
        AncestralUtils.PhysicsProfile memory zulu = AncestralUtils.zuluConstants();
        s.tribes[1].name = "Zulu";
        s.tribes[1].isActive = true;
        s.tribes[1].mass = zulu.mass;
        s.tribes[1].buoyancy = zulu.buoyancy;
        s.tribes[1].tribeId = 1;

        // ── Index 2: Xhosa (Resonance Buoyancy) ──
        AncestralUtils.PhysicsProfile memory xhosa = AncestralUtils.xhosaConstants();
        s.tribes[2].name = "Xhosa";
        s.tribes[2].isActive = true;
        s.tribes[2].mass = xhosa.mass;
        s.tribes[2].buoyancy = xhosa.buoyancy;
        s.tribes[2].tribeId = 2;

        // ── Index 3: Sotho (Steadfast Bridge) ──
        AncestralUtils.PhysicsProfile memory sotho = AncestralUtils.sothoConstants();
        s.tribes[3].name = "Sotho";
        s.tribes[3].isActive = true;
        s.tribes[3].mass = sotho.mass;
        s.tribes[3].buoyancy = sotho.buoyancy;
        s.tribes[3].tribeId = 3;

        // ── Index 4: Setswana (Diplomatic Balance) ──
        AncestralUtils.PhysicsProfile memory setswana = AncestralUtils.setswanaConstants();
        s.tribes[4].name = "Setswana";
        s.tribes[4].isActive = true;
        s.tribes[4].mass = setswana.mass;
        s.tribes[4].buoyancy = setswana.buoyancy;
        s.tribes[4].tribeId = 4;

        // ── Index 5: Sepedi (Regenerative Healer) ──
        AncestralUtils.PhysicsProfile memory sepedi = AncestralUtils.sepediConstants();
        s.tribes[5].name = "Sepedi";
        s.tribes[5].isActive = true;
        s.tribes[5].mass = sepedi.mass;
        s.tribes[5].buoyancy = sepedi.buoyancy;
        s.tribes[5].tribeId = 5;

        // ── Index 6: Xitsonga (Xibelani Spin) ──
        AncestralUtils.PhysicsProfile memory xitsonga = AncestralUtils.xitsongaConstants();
        s.tribes[6].name = "Xitsonga";
        s.tribes[6].isActive = true;
        s.tribes[6].mass = xitsonga.mass;
        s.tribes[6].buoyancy = xitsonga.buoyancy;
        s.tribes[6].tribeId = 6;

        // ── Index 7: Swati (Ceremonial Dancer) ──
        AncestralUtils.PhysicsProfile memory swati = AncestralUtils.swatiConstants();
        s.tribes[7].name = "Swati";
        s.tribes[7].isActive = true;
        s.tribes[7].mass = swati.mass;
        s.tribes[7].buoyancy = swati.buoyancy;
        s.tribes[7].tribeId = 7;

        // ── Index 8: Venda (Mystic Anchor) ──
        AncestralUtils.PhysicsProfile memory venda = AncestralUtils.vendaConstants();
        s.tribes[8].name = "Venda";
        s.tribes[8].isActive = true;
        s.tribes[8].mass = venda.mass;
        s.tribes[8].buoyancy = venda.buoyancy;
        s.tribes[8].tribeId = 8;

        // ── Index 9: isiNdebele (Symmetric Harmony) ──
        AncestralUtils.PhysicsProfile memory ndebele = AncestralUtils.ndebeleConstants();
        s.tribes[9].name = "isiNdebele";
        s.tribes[9].isActive = true;
        s.tribes[9].mass = ndebele.mass;
        s.tribes[9].buoyancy = ndebele.buoyancy;
        s.tribes[9].tribeId = 9;

        // ── Index 10: Tsonga (Coastal Drift) ──
        AncestralUtils.PhysicsProfile memory tsonga = AncestralUtils.tsongaConstants();
        s.tribes[10].name = "Tsonga";
        s.tribes[10].isActive = true;
        s.tribes[10].mass = tsonga.mass;
        s.tribes[10].buoyancy = tsonga.buoyancy;
        s.tribes[10].tribeId = 10;

        // ── Index 11: Afrikaans (Frontier Forge) ──
        AncestralUtils.PhysicsProfile memory afrikaans = AncestralUtils.afrikaansConstants();
        s.tribes[11].name = "Afrikaans";
        s.tribes[11].isActive = true;
        s.tribes[11].mass = afrikaans.mass;
        s.tribes[11].buoyancy = afrikaans.buoyancy;
        s.tribes[11].tribeId = 11;

        // ── Index 12: The Synthesis (Coloured / Integration Layer) ──
        s.tribes[12].name = "Synthesis";
        s.tribes[12].isActive = true;
        s.tribes[12].mass = 70;
        s.tribes[12].buoyancy = 80;
        s.tribes[12].tribeId = 12;
    }

    /**
     * @notice Records a Xibelani Resonance Cascade (5+ matches).
     * @param _bunnyId The ID of the bunny triggered.
     * @param _matches Number of circular matches.
     * @param _duration Duration of the cascade.
     */
    function recordResonanceCascade(uint256 _bunnyId, uint256 _matches, uint256 _duration) external {
        AppStorage storage ds = LibAppStorage.diamondStorage();
        require(ds.bunnyIndexToOwner[_bunnyId] == msg.sender, "Auditor: Not your bunny");
        
        uint256 bonus = AncestralUtils.calculateResonanceCascade(_matches, _duration);
        require(bonus > 0, "Resonance: Cascade failure");
        
        ds.bunnies[_bunnyId].resonance += bonus;
        
        // Tribal Reward: +25% UP fuel
        uint256 upGain = (bonus * 10); // Scale UP gain to resonance gain
        ds.totalUbuntuPoints[msg.sender] += upGain;

        emit AscensionRitualComplete(msg.sender, 6, block.timestamp);
    }

    /**
     * @notice Allows a player to commit to a specific ancestral line.
     * @param _tribeId The ID of the tribe (0-12).
     */
    function joinTribe(uint256 _tribeId) external {
        AppStorage storage s = LibAppStorage.diamondStorage();
        require(s.tribes[_tribeId].isActive, "Tribe does not exist");

        // THE GENESIS GATE:
        // Tribe 0 (Khoe-San/Foundation) requires completion of the Antigravity Experiment.
        // This proves the player understands the Integration Layer and has achieved ≥30% mass reduction.
        if (_tribeId == 0) {
            require(
                s.experimentCompleted[msg.sender], 
                "Khoe-San requires Genesis Experiment (30%+ lift)"
            );
        }

        // THE BALANCED BRIDGE LOCK:
        // Tribe 12 (Synthesis) requires Bit 0 (Khoe-San) foundation.
        if (_tribeId == 12) {
            require((s.playerBuffs[msg.sender] & (1 << 0)) != 0, "Synthesis requires Khoe-San foundation");        
        }

        s.playerTribe[msg.sender] = _tribeId;
        s.playerResonance[msg.sender] = 1;
        
        // Auto-assign the base tribal buff bit (Bitwise Shift)
        // This marks the bit at the position of the Tribe ID as 'active' (1)
        s.playerBuffs[msg.sender] = (1 << _tribeId);

        emit AscensionRitualComplete(msg.sender, _tribeId, block.timestamp);
    }

    /**
     * @notice The Balanced Bridge Move: Synthesis players choose their borrowed power.
     * @dev Only accessible by Tribe 12. Allows borrowing passives from Index 0-11.
     * @param _borrowedTribeId The tribe (0-11) to borrow a passive from.
     */
    function selectSynthesisBuff(uint256 _borrowedTribeId) external {
        AppStorage storage s = LibAppStorage.diamondStorage();
        
        // 1. Ensure the player belongs to the Integration Layer
        require(s.playerTribe[msg.sender] == 12, "Only Synthesis tribe can bridge");
        
        // 2. Validate the target (The Bridge reaches back to Foundation 0 through Tribe 11)
        require(_borrowedTribeId < 12, "Invalid borrow target");

        // 3. Bitwise Synthesis: 
        // We keep the Tribe 12 bit (1 << 12) AND add the borrowed tribe bit (1 << _borrowedTribeId)
        // using the OR (|) operator.
        uint256 newMask = (1 << 12) | (1 << _borrowedTribeId);
        
        s.playerBuffs[msg.sender] = newMask;
    }

    /**
     * @notice Returns the current state of an initiate.
     */
    function getPlayerStats(address _player) external view returns (
        uint256 tribeId, 
        uint256 resonance, 
        uint256 buffMask
    ) {
        AppStorage storage s = LibAppStorage.diamondStorage();
        return (s.playerTribe[_player], s.playerResonance[_player], s.playerBuffs[_player]);
    }

    /**
     * @notice Helper to check tribal capacity.
     */
    function getTribeCount() external pure returns (uint256) {
        return 13;
    }

    /**
     * @notice Manual check for a specific tribe's existence in storage.
     */
    function getTribe(uint256 _tribeId) external view returns (string memory name, bool isActive) {
        AppStorage storage s = LibAppStorage.diamondStorage();
        return (s.tribes[_tribeId].name, s.tribes[_tribeId].isActive);
    }
}