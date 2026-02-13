// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { LibAppStorage, AppStorage, ExperimentRecord } from "../libraries/LibAppStorage.sol";

/**
 * @title AntigravityFacet
 * @notice Records and validates antigravity experiment data to gate access to ǃKaggen (Bunny #0).
 * @dev Part of the Diamond Standard (EIP-2535) architecture for Resonant Realms Saga.
 * 
 * Philosophy: The player becomes the "Observer" in a quantum experiment. Their ability to achieve
 * 30%+ mass reduction proves they understand the Integration Layer between Foundation and Synthesis.
 */
contract AntigravityFacet {
    
    /**
     * @notice Emitted when a player completes a successful antigravity experiment.
     * @param player Address of the experimenter
     * @param liftPercent Achieved lift percentage in basis points (3000 = 30.00%)
     * @param peakVoltage Maximum voltage reached in experiment (in kV * 100, e.g., 5000 = 50kV)
     * @param telemetryHash Keccak256 hash of complete experiment telemetry data
     * @param timestamp Block timestamp of experiment completion
     */
    event ExperimentCompleted(
        address indexed player,
        uint256 liftPercent,
        uint256 peakVoltage,
        bytes32 telemetryHash,
        uint256 timestamp,
        string metadataURI
    );

    /**
     * @notice Records a successful antigravity experiment and grants Ascension eligibility.
     * @dev Requires minimum 30% lift (3000 basis points) to pass threshold.
     * 
     * Calculation: Lift% = (|ΔWeight| / BaselineWeight) × 100
     * 
     * @param _liftPercent Peak mass reduction in basis points (e.g., 5020 = 50.20%)
     * @param _peakVoltage Peak voltage in experiment (kV * 100, e.g., 5000 = 50.00kV)
     * @param _telemetryHash Keccak256 hash of JSON telemetry data
     */
    function recordExperiment(
        uint256 _liftPercent,
        uint256 _peakVoltage,
        bytes32 _telemetryHash,
        string calldata _metadataURI,
        uint256 _adversaryBuffer
    ) external {
        AppStorage storage s = LibAppStorage.diamondStorage();
        
        // Validation: Minimum 30% reduction required for Ascension
        require(_liftPercent >= 3000, "AntigravityFacet: Insufficient lift for Ascension");
        
        // Validation: Voltage must be in realistic range (10kV - 100kV)
        require(_peakVoltage >= 1000 && _peakVoltage <= 10000, "AntigravityFacet: Invalid voltage range");
        
        // Validation: Cannot record multiple experiments (one-time ritual)
        require(!s.experimentCompleted[msg.sender], "AntigravityFacet: Already ascended");
        
        // Mark player as having completed the Genesis Experiment
        s.experimentCompleted[msg.sender] = true;
        
        // Store experiment metadata
        s.experimentData[msg.sender] = ExperimentRecord({
            liftPercent: _liftPercent,
            peakVoltage: _peakVoltage,
            telemetryHash: _telemetryHash,
            timestamp: block.timestamp,
            metadataURI: _metadataURI,
            adversaryBuffer: _adversaryBuffer
        });
        
        emit ExperimentCompleted(
            msg.sender,
            _liftPercent,
            _peakVoltage,
            _telemetryHash,
            block.timestamp,
            _metadataURI
        );
    }

    /**
     * @notice Checks if a player has passed the antigravity threshold (≥30% lift).
     * @param _player Address to check
     * @return bool True if player has completed experiment with sufficient lift
     */
    function hasPassedThreshold(address _player) external view returns (bool) {
        AppStorage storage s = LibAppStorage.diamondStorage();
        return s.experimentCompleted[_player];
    }

    /**
     * @notice Retrieves the complete experiment record for a player.
     * @param _player Address of the experimenter
     * @return liftPercent Maximum lift achieved (basis points)
     * @return peakVoltage Peak voltage reached (kV * 100)
     * @return telemetryHash Hash of experiment data
     * @return timestamp When experiment was completed
     */
    function getExperimentData(address _player) external view returns (
        uint256 liftPercent,
        uint256 peakVoltage,
        bytes32 telemetryHash,
        uint256 timestamp,
        string memory metadataURI,
        uint256 adversaryBuffer
    ) {
        AppStorage storage s = LibAppStorage.diamondStorage();
        ExperimentRecord memory record = s.experimentData[_player];
        
        return (
            record.liftPercent,
            record.peakVoltage,
            record.telemetryHash,
            record.timestamp,
            record.metadataURI,
            record.adversaryBuffer
        );
    }

    /**
     * @notice Returns the minimum lift percentage required for Ascension.
     * @return uint256 Threshold in basis points (3000 = 30%)
     */
    function getThreshold() external pure returns (uint256) {
        return 3000; // 30.00%
    }
}
