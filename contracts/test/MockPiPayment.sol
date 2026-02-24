// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { LibAppStorage, AppStorage } from "../libraries/LibAppStorage.sol";

/**
 * @title UL-TEST-MOCK-PI-01: Mock Pi Payment Logic
 * @notice Safe simulation environment for Pi Network payments
 * @dev To be used in the 'Mind' (Local Hardhat Node) only
 * 
 * Logic Purpose:
 * Creating a safe simulation environment for Pi Network payments 
 * without touching the live SDK or mainnet.
 */
contract MockPiPayment {
    
    event MockPiPaymentProcessed(
        bytes32 indexed mockTxId,
        address indexed user,
        uint256 amount,
        uint256 ubuntuPointsAwarded
    );
    
    /**
     * @notice Simulates Pi Network SDK callback for local testing
     * @param _user Address receiving the payment
     * @param _amount Pi amount (in wei/mini-Pi units)
     * @return mockTxId Generated transaction ID
     */
    function mockPiPayment(address _user, uint256 _amount) external returns (bytes32 mockTxId) {
        AppStorage storage s = LibAppStorage.diamondStorage();
        
        // Generate mock transaction ID
        mockTxId = keccak256(abi.encodePacked(block.timestamp, _user, _amount, block.number));
        
        // Mark as processed
        s.processedPiPayments[mockTxId] = true;
        
        // Calculate Ubuntu Points (1 Pi = 1000 UP)
        uint256 upAwarded = _amount * 1000;
        s.totalUbuntuPoints[_user] += upAwarded;
        
        emit MockPiPaymentProcessed(mockTxId, _user, _amount, upAwarded);
        
        return mockTxId;
    }
    
    /**
     * @notice Checks if a mock payment was processed
     * @param _txId Transaction ID to check
     * @return True if payment was processed
     */
    function isMockPaymentProcessed(bytes32 _txId) external view returns (bool) {
        AppStorage storage s = LibAppStorage.diamondStorage();
        return s.processedPiPayments[_txId];
    }
    
    /**
     * @notice Gets total Ubuntu Points for a user
     * @param _user User address
     * @return Total Ubuntu Points
     */
    function getUserUbuntuPoints(address _user) external view returns (uint256) {
        AppStorage storage s = LibAppStorage.diamondStorage();
        return s.totalUbuntuPoints[_user];
    }
}
