// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { LibAppStorage, AppStorage, PiPayment } from "../libraries/LibAppStorage.sol";
import { LibDiamond } from "../libraries/LibDiamond.sol";

/**
 * @title PiPaymentFacet
 * @notice Handles Pi Network cryptocurrency payments and reward distribution.
 * @dev Integrates with Pi Network SDK for real-value transactions.
 */
contract PiPaymentFacet {
    
    // --- Events ---
    event PiPaymentReceived(
        bytes32 indexed paymentId,
        address indexed payer,
        uint256 amount,
        uint256 timestamp
    );
    
    event RewardClaimed(
        bytes32 indexed paymentId,
        address indexed claimant,
        uint256 ubuntuPointsAwarded,
        uint256 resonanceBonus
    );
    
    event FundsWithdrawn(
        address indexed recipient,
        uint256 amount
    );
    
    event KycGateEnforced(
        address indexed player,
        uint8 requiredLevel,
        bool passed
    );

    // --- Errors ---
    error InvalidPaymentAmount();
    error PaymentAlreadyExists();
    error PaymentNotFound();
    error RewardsAlreadyClaimed();
    error KycRequired(uint8 requiredLevel);
    error UnauthorizedWithdrawal();
    error InsufficientFunds();

    // --- Modifiers ---
    modifier onlyContractOwner() {
        LibDiamond.enforceIsContractOwner();
        _;
    }

    /**
     * @notice Processes a Pi Network payment and records it on-chain.
     * @param _paymentId Unique identifier from Pi Network.
     * @param _amount Amount in Pi (wei equivalent).
     * @param _metadataURI URI to payment metadata.
     * @dev Callable by contract owner (oracle) after Pi SDK verification.
     */
    function processPiPayment(
        bytes32 _paymentId,
        uint256 _amount,
        string calldata _metadataURI
    ) external onlyContractOwner {
        if (_amount == 0) revert InvalidPaymentAmount();
        
        AppStorage storage s = LibAppStorage.diamondStorage();
        
        // Check if payment already exists
        if (s.piPayments[_paymentId].timestamp != 0) {
            revert PaymentAlreadyExists();
        }
        
        // Record the payment
        s.piPayments[_paymentId] = PiPayment({
            paymentId: _paymentId,
            payer: msg.sender,
            amount: _amount,
            timestamp: block.timestamp,
            claimed: false,
            metadataURI: _metadataURI
        });
        
        // Track user's payment history
        s.userPaymentIds[msg.sender].push(_paymentId);
        
        // Update total revenue
        s.totalPiRevenue += _amount;
        
        emit PiPaymentReceived(_paymentId, msg.sender, _amount, block.timestamp);
    }

    /**
     * @notice Claims rewards for a Pi payment.
     * @param _paymentId The payment ID to claim rewards for.
     * @dev Awards Ubuntu Points and Resonance based on payment amount.
     */
    function claimRewards(bytes32 _paymentId) external {
        AppStorage storage s = LibAppStorage.diamondStorage();
        
        PiPayment storage payment = s.piPayments[_paymentId];
        
        if (payment.timestamp == 0) revert PaymentNotFound();
        if (payment.claimed) revert RewardsAlreadyClaimed();
        
        // KYC Gate: Require at least Basic KYC (Level 1) for claiming
        if (s.kycStatus[msg.sender].level < 1) {
            emit KycGateEnforced(msg.sender, 1, false);
            revert KycRequired(1);
        }
        
        // Calculate rewards
        // 1 Pi = 1000 Ubuntu Points base rate
        uint256 upAwarded = (payment.amount * 1000) / 1e18;
        
        // Resonance bonus: 1% of UP as resonance
        uint256 resonanceBonus = upAwarded / 100;
        
        // Award rewards
        s.totalUbuntuPoints[msg.sender] += upAwarded;
        s.playerResonance[msg.sender] += resonanceBonus;
        
        // Mark as claimed
        payment.claimed = true;
        
        emit RewardClaimed(_paymentId, msg.sender, upAwarded, resonanceBonus);
    }

    /**
     * @notice Allows contract owner to withdraw accumulated funds.
     * @param _recipient Address to send funds to.
     * @param _amount Amount to withdraw.
     */
    function withdrawFunds(address _recipient, uint256 _amount) external onlyContractOwner {
        if (_amount > address(this).balance) revert InsufficientFunds();
        
        (bool success, ) = _recipient.call{value: _amount}("");
        if (!success) revert UnauthorizedWithdrawal();
        
        emit FundsWithdrawn(_recipient, _amount);
    }

    /**
     * @notice Gets payment details for a specific payment ID.
     * @param _paymentId The payment ID to query.
     * @return Payment details struct.
     */
    function getPayment(bytes32 _paymentId) external view returns (PiPayment memory) {
        AppStorage storage s = LibAppStorage.diamondStorage();
        return s.piPayments[_paymentId];
    }

    /**
     * @notice Gets all payment IDs for a user.
     * @param _user Address to query.
     * @return Array of payment IDs.
     */
    function getUserPayments(address _user) external view returns (bytes32[] memory) {
        AppStorage storage s = LibAppStorage.diamondStorage();
        return s.userPaymentIds[_user];
    }

    /**
     * @notice Gets total Pi revenue collected.
     * @return Total revenue in wei.
     */
    function getTotalRevenue() external view returns (uint256) {
        AppStorage storage s = LibAppStorage.diamondStorage();
        return s.totalPiRevenue;
    }

    /**
     * @notice Checks if a payment has been claimed.
     * @param _paymentId The payment ID to check.
     * @return True if claimed, false otherwise.
     */
    function isPaymentClaimed(bytes32 _paymentId) external view returns (bool) {
        AppStorage storage s = LibAppStorage.diamondStorage();
        return s.piPayments[_paymentId].claimed;
    }

    /**
     * @notice Fallback function to receive Pi payments directly.
     */
    receive() external payable {
        // Payments are processed via processPiPayment by oracle
        // Direct transfers are logged but require oracle verification
    }
}
