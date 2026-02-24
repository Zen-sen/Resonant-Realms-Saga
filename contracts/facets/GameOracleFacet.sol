// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { LibAppStorage, AppStorage, GameResult } from "../libraries/LibAppStorage.sol";
import { LibDiamond } from "../libraries/LibDiamond.sol";

/**
 * @title GameOracleFacet
 * @notice Oracle for Match-3 game results and leaderboard management.
 * @dev Bridges off-chain game server with on-chain rewards.
 */
contract GameOracleFacet {
    
    // --- Events ---
    event GameResultSubmitted(
        bytes32 indexed resultId,
        address indexed player,
        uint256 score,
        uint256 timestamp
    );
    
    event GameResultVerified(
        bytes32 indexed resultId,
        address indexed verifier,
        uint256 resonanceAwarded
    );
    
    event OracleOperatorUpdated(
        address indexed previousOperator,
        address indexed newOperator
    );
    
    event LeaderboardUpdated(
        uint256 indexed period,
        address[] topPlayers,
        uint256[] scores
    );

    // --- Errors ---
    error InvalidGameScore();
    error ResultAlreadySubmitted();
    error ResultNotFound();
    error UnauthorizedVerifier();
    error InvalidProof();
    error OracleNotSet();


    // --- Modifiers ---
    modifier onlyContractOwner() {
        LibDiamond.enforceIsContractOwner();
        _;
    }

    modifier onlyOracleOperator() {
        AppStorage storage s = LibAppStorage.diamondStorage();
        if (msg.sender != s.oracleOperator && msg.sender != s.contractOwner) {
            revert UnauthorizedVerifier();
        }
        _;
    }


    /**
     * @notice Sets the authorized oracle operator address.
     * @param _operator Address of the oracle operator.
     */
    function setOracleOperator(address _operator) external onlyContractOwner {
        AppStorage storage s = LibAppStorage.diamondStorage();
        
        address previousOperator = s.oracleOperator;
        s.oracleOperator = _operator;
        
        emit OracleOperatorUpdated(previousOperator, _operator);
    }

    /**
     * @notice Submits a game result from the off-chain server.
     * @param _resultId Unique result identifier.
     * @param _player Player address.
     * @param _score Match-3 score achieved.
     * @param _proofHash Proof of valid game session.
     */
    function submitGameResult(
        bytes32 _resultId,
        address _player,
        uint256 _score,
        bytes32 _proofHash
    ) external onlyOracleOperator {
        if (_score == 0) revert InvalidGameScore();
        
        AppStorage storage s = LibAppStorage.diamondStorage();
        
        // Check if result already exists
        if (s.gameResults[_resultId].timestamp != 0) {
            revert ResultAlreadySubmitted();
        }

        
        // Calculate resonance gain based on score
        // Formula: resonance = score / 1000 (1 resonance per 1000 points)
        uint256 resonanceGain = _score / 1000;
        
        // Record the game result
        s.gameResults[_resultId] = GameResult({
            resultId: _resultId,
            player: _player,
            score: _score,
            resonanceGain: resonanceGain,
            timestamp: block.timestamp,
            verified: true, // Auto-verified when submitted by oracle
            proofHash: _proofHash
        });
        
        // Track player's game history
        s.playerGameResults[_player].push(_resultId);
        
        // Award Ubuntu Points based on score
        // 1 point = 1 UP
        s.totalUbuntuPoints[_player] += (_score / 100);
        
        // Award resonance
        s.playerResonance[_player] += resonanceGain;
        
        emit GameResultSubmitted(_resultId, _player, _score, block.timestamp);
        emit GameResultVerified(_resultId, msg.sender, resonanceGain);
    }

    /**
     * @notice Verifies a previously submitted game result.
     * @param _resultId Result ID to verify.
     * @dev Can be used for manual verification if needed.
     */
    function verifyResult(bytes32 _resultId) external onlyOracleOperator {
        AppStorage storage s = LibAppStorage.diamondStorage();
        
        if (s.gameResults[_resultId].timestamp == 0) {
            revert ResultNotFound();
        }

        
        s.gameResults[_resultId].verified = true;
        
        emit GameResultVerified(
            _resultId,
            msg.sender,
            s.gameResults[_resultId].resonanceGain
        );
    }

    /**
     * @notice Gets a game result by ID.
     * @param _resultId Result ID to query.
     * @return Game result struct.
     */
    function getGameResult(bytes32 _resultId) external view returns (GameResult memory) {
        AppStorage storage s = LibAppStorage.diamondStorage();
        return s.gameResults[_resultId];
    }

    /**
     * @notice Gets all game result IDs for a player.
     * @param _player Player address.
     * @return Array of result IDs.
     */
    function getPlayerGameResults(address _player) external view returns (bytes32[] memory) {
        AppStorage storage s = LibAppStorage.diamondStorage();
        return s.playerGameResults[_player];
    }

    /**
     * @notice Gets the total number of games played by a player.
     * @param _player Player address.
     * @return Number of games.
     */
    function getPlayerGameCount(address _player) external view returns (uint256) {
        AppStorage storage s = LibAppStorage.diamondStorage();
        return s.playerGameResults[_player].length;
    }

    /**
     * @notice Gets the current oracle operator address.
     * @return Oracle operator address.
     */
    function getOracleOperator() external view returns (address) {
        AppStorage storage s = LibAppStorage.diamondStorage();
        return s.oracleOperator;
    }

    /**
     * @notice Batch submit multiple game results (gas efficient).
     * @param _resultIds Array of result IDs.
     * @param _players Array of player addresses.
     * @param _scores Array of scores.
     * @param _proofHashes Array of proof hashes.
     */
    function batchSubmitGameResults(
        bytes32[] calldata _resultIds,
        address[] calldata _players,
        uint256[] calldata _scores,
        bytes32[] calldata _proofHashes
    ) external onlyOracleOperator {
        uint256 batchSize = _resultIds.length;
        
        if (batchSize != _players.length || batchSize != _scores.length || batchSize != _proofHashes.length) {
            revert InvalidProof();
        }

        
        AppStorage storage s = LibAppStorage.diamondStorage();
        
        for (uint256 i = 0; i < batchSize; i++) {
            if (_scores[i] == 0) continue; // Skip invalid scores
            
            uint256 resonanceGain = _scores[i] / 1000;
            
            s.gameResults[_resultIds[i]] = GameResult({
                resultId: _resultIds[i],
                player: _players[i],
                score: _scores[i],
                resonanceGain: resonanceGain,
                timestamp: block.timestamp,
                verified: true,
                proofHash: _proofHashes[i]
            });
            
            s.playerGameResults[_players[i]].push(_resultIds[i]);
            s.totalUbuntuPoints[_players[i]] += (_scores[i] / 100);
            s.playerResonance[_players[i]] += resonanceGain;
            
            emit GameResultSubmitted(_resultIds[i], _players[i], _scores[i], block.timestamp);
        }
    }

    /**
     * @notice Gets the top scores for a specific time period.
     * @param _startTime Start of period.
     * @param _endTime End of period.
     * @param _maxResults Maximum number of results to return.
     * @return players Array of player addresses.
     * @return scores Array of player scores.
     */

    function getLeaderboard(
        uint256 _startTime,
        uint256 _endTime,
        uint256 _maxResults
    ) external view returns (address[] memory players, uint256[] memory scores) {
        AppStorage storage s = LibAppStorage.diamondStorage();
        
        // This is a simplified implementation
        // In production, you'd want to use a more efficient data structure
        // like a sorted list or off-chain indexing with Merkle proofs
        
        players = new address[](_maxResults);
        scores = new uint256[](_maxResults);
        
        // Placeholder: Return empty arrays
        // Real implementation would iterate through game results
        
        return (players, scores);
    }

    /**
     * @notice Updates the leaderboard for a period.
     * @param _period Period identifier.
     * @param _topPlayers Array of top player addresses.
     * @param _scores Array of scores.
     */
    function updateLeaderboard(
        uint256 _period,
        address[] calldata _topPlayers,
        uint256[] calldata _scores
    ) external onlyOracleOperator {
        emit LeaderboardUpdated(_period, _topPlayers, _scores);
    }
}
