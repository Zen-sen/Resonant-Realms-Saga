// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { LibAppStorage, AppStorage, KycStatus } from "../libraries/LibAppStorage.sol";
import { LibDiamond } from "../libraries/LibDiamond.sol";

/**
 * @title KycVerificationFacet
 * @notice Manages Pi Network KYC verification and identity gating.
 * @dev Integrates with Pi Network identity system for trust verification.
 */
contract KycVerificationFacet {
    
    // --- Events ---
    event KycSubmitted(
        address indexed user,
        bytes32 indexed piUsernameHash,
        uint8 requestedLevel
    );
    
    event KycVerified(
        address indexed user,
        uint8 level,
        uint256 verifiedAt
    );
    
    event KycRevoked(
        address indexed user,
        uint8 previousLevel,
        string reason
    );
    
    event KycRequirementUpdated(
        uint8 indexed level,
        uint256 ubuntuPointsRequired
    );

    // --- Errors ---
    error InvalidKycLevel();
    error AlreadyVerified();
    error NotVerified();
    error InsufficientUbuntuPoints();
    error UnauthorizedVerifier();

    // --- Modifiers ---
    modifier onlyContractOwner() {
        LibDiamond.enforceIsContractOwner();
        _;
    }

    /**
     * @notice Submits KYC application for a user.
     * @param _piUsernameHash Hashed Pi username for privacy.
     * @param _requestedLevel KYC level requested (1-3).
     * @param _documentURI URI to encrypted verification documents.
     */
    function submitKyc(
        bytes32 _piUsernameHash,
        uint8 _requestedLevel,
        string calldata _documentURI
    ) external {
        if (_requestedLevel == 0 || _requestedLevel > 3) revert InvalidKycLevel();
        
        AppStorage storage s = LibAppStorage.diamondStorage();
        
        // Check if already verified at this level or higher
        if (s.kycStatus[msg.sender].level >= _requestedLevel) {
            revert AlreadyVerified();
        }
        
        // Check UP requirements
        uint256 upRequired = s.kycLevelRequirements[_requestedLevel];
        if (s.totalUbuntuPoints[msg.sender] < upRequired) {
            revert InsufficientUbuntuPoints();
        }
        
        // Record KYC submission
        s.kycStatus[msg.sender] = KycStatus({
            level: 0, // Pending verification
            verified: false,
            verifiedAt: 0,
            piUsernameHash: _piUsernameHash,
            documentURI: _documentURI
        });
        
        emit KycSubmitted(msg.sender, _piUsernameHash, _requestedLevel);
    }

    /**
     * @notice Verifies a user's KYC (callable only by contract owner/oracle).
     * @param _user Address to verify.
     * @param _level KYC level to grant (1-3).
     */
    function verifyKyc(address _user, uint8 _level) external onlyContractOwner {
        if (_level == 0 || _level > 3) revert InvalidKycLevel();
        
        AppStorage storage s = LibAppStorage.diamondStorage();
        
        s.kycStatus[_user].level = _level;
        s.kycStatus[_user].verified = true;
        s.kycStatus[_user].verifiedAt = block.timestamp;
        
        emit KycVerified(_user, _level, block.timestamp);
    }

    /**
     * @notice Revokes a user's KYC verification.
     * @param _user Address to revoke.
     * @param _reason Reason for revocation.
     */
    function revokeKyc(address _user, string calldata _reason) external onlyContractOwner {
        AppStorage storage s = LibAppStorage.diamondStorage();
        
        if (!s.kycStatus[_user].verified) revert NotVerified();
        
        uint8 previousLevel = s.kycStatus[_user].level;
        
        s.kycStatus[_user].level = 0;
        s.kycStatus[_user].verified = false;
        s.kycStatus[_user].verifiedAt = 0;
        
        emit KycRevoked(_user, previousLevel, _reason);
    }

    /**
     * @notice Sets Ubuntu Points requirements for each KYC level.
     * @param _level KYC level (1-3).
     * @param _upRequired Ubuntu Points required.
     */
    function setKycRequirements(uint8 _level, uint256 _upRequired) external onlyContractOwner {
        if (_level == 0 || _level > 3) revert InvalidKycLevel();
        
        AppStorage storage s = LibAppStorage.diamondStorage();
        s.kycLevelRequirements[_level] = _upRequired;
        
        emit KycRequirementUpdated(_level, _upRequired);
    }

    /**
     * @notice Gets KYC status for a user.
     * @param _user Address to query.
     * @return KYC status struct.
     */
    function getKycStatus(address _user) external view returns (KycStatus memory) {
        AppStorage storage s = LibAppStorage.diamondStorage();
        return s.kycStatus[_user];
    }

    /**
     * @notice Gets KYC level for a user (convenience function).
     * @param _user Address to query.
     * @return KYC level (0-3).
     */
    function getKycLevel(address _user) external view returns (uint8) {
        AppStorage storage s = LibAppStorage.diamondStorage();
        return s.kycStatus[_user].level;
    }

    /**
     * @notice Checks if a user is verified at a specific level or higher.
     * @param _user Address to check.
     * @param _minLevel Minimum required level.
     * @return True if verified at or above the required level.
     */
    function isKycVerified(address _user, uint8 _minLevel) external view returns (bool) {
        AppStorage storage s = LibAppStorage.diamondStorage();
        return s.kycStatus[_user].verified && s.kycStatus[_user].level >= _minLevel;
    }

    /**
     * @notice Gets UP requirements for a KYC level.
     * @param _level KYC level to query.
     * @return Ubuntu Points required.
     */
    function getKycRequirements(uint8 _level) external view returns (uint256) {
        AppStorage storage s = LibAppStorage.diamondStorage();
        return s.kycLevelRequirements[_level];
    }

    /**
     * @notice Batch verify multiple users (gas efficient for oracle).
     * @param _users Array of addresses to verify.
     * @param _level KYC level to grant.
     */
    function batchVerifyKyc(address[] calldata _users, uint8 _level) external onlyContractOwner {
        if (_level == 0 || _level > 3) revert InvalidKycLevel();
        
        AppStorage storage s = LibAppStorage.diamondStorage();
        
        for (uint256 i = 0; i < _users.length; i++) {
            s.kycStatus[_users[i]].level = _level;
            s.kycStatus[_users[i]].verified = true;
            s.kycStatus[_users[i]].verifiedAt = block.timestamp;
            
            emit KycVerified(_users[i], _level, block.timestamp);
        }
    }

    /**
     * @notice Enforces KYC gate for a function call.
     * @param _caller Address to check.
     * @param _requiredLevel Minimum KYC level required.
     */
    function enforceKycGate(address _caller, uint8 _requiredLevel) external view {
        AppStorage storage s = LibAppStorage.diamondStorage();
        
        if (!s.kycStatus[_caller].verified || s.kycStatus[_caller].level < _requiredLevel) {
            revert InsufficientUbuntuPoints(); // Reusing error for gas efficiency
        }
    }
}
