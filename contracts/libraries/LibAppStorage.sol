// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/**
 * @title Resonant Realms Saga - Master Storage
 * @notice Integrated with Google Gravity / Anti-Pattern Physics
 */

struct Tribe {
    string name;
    uint256 baseResonance;
    bool isActive;
    // --- Anti-Gravity Expansion ---
    int256 mass;      // Standard is 100. (Khoe-San/Index 0 is higher)
    int256 buoyancy;  // Standard is 0. (Bridge/Index 12 is higher)
    uint256 tribeId;  // Explicit ID for lookup logic
}

struct Bunny {
    uint256 genes;
    uint256 birthTime;
    uint256 tribeId;
    uint256 generation;
    uint256 resonance;
    uint256 matronId;
    uint256 sireId;
    uint256 cooldownEnd;
}

struct Human {
    uint256 dna;
    uint256 awakenedTime;
    uint256 tribeId;
    uint256 level;
    uint256 ubuntuPower;
}

// Struct to track the "Google Gravity" state of tiles in the Match-3 engine
struct TilePhysics {
    int256 x;
    int256 y;
    int256 velocityY;
    bool isFloating;
}

struct AppStorage {
    // --- Diamond Standard Internals ---
    address contractOwner;
    mapping(bytes4 => address) selectorToFacet;
    address[] facets;

    // --- Tribal & Player State ---
    mapping(uint256 => Tribe) tribes;
    mapping(address => uint256) playerTribe;
    mapping(address => bool) hasJoinedTribe;
    mapping(address => uint256) playerResonance;
    mapping(address => uint256) playerBuffs;

    // --- Ubuntu & Mentorship Logic ---
    mapping(address => uint256) totalUbuntuPoints;
    mapping(address => uint256) generosityRank;
    mapping(address => uint256) lastGiftTime;
    mapping(uint256 => uint256) tribePools;

    // --- Entity Collections (Bunnies & Humans) ---
    mapping(uint256 => Bunny) bunnies;
    uint256 bunnyCount;
    mapping(uint256 => Human) humans;
    uint256 humanCount;
    mapping(uint256 => address) bunnyIndexToOwner;
    mapping(uint256 => address) humanIndexToOwner;
    mapping(address => uint256) ownerHumanCount;

    // --- Physics Engine State (The Mind Sync) ---
    mapping(uint256 => TilePhysics) bunnyPhysics; // Link physics to specific Sage/Bunny IDs

    // --- Antigravity Experiment State ---
    mapping(address => bool) experimentCompleted; // Has player completed Genesis Experiment?
    mapping(address => ExperimentRecord) experimentData; // Full experiment record per player

    // --- Phase 6: Pi Network Integration State ---
    
    // Pi Payment System
    mapping(bytes32 => PiPayment) piPayments;           // Payment ID to payment record
    mapping(address => bytes32[]) userPaymentIds;       // User's payment history
    uint256 totalPiRevenue;                             // Total Pi revenue collected
    
    // KYC Verification System
    mapping(address => KycStatus) kycStatus;            // User KYC status
    mapping(uint8 => uint256) kycLevelRequirements;   // UP requirements per KYC level
    
    // Game Oracle System
    mapping(bytes32 => GameResult) gameResults;         // Result ID to game result
    mapping(address => bytes32[]) playerGameResults;    // Player's game history
    address oracleOperator;                             // Authorized oracle operator
    
    // Ancestral Relic System
    mapping(uint256 => AncestralRelic) relics;          // Relic ID to relic data
    mapping(address => uint256[]) userRelics;           // User's owned relics
    uint256 nextRelicId;                                // Auto-increment relic ID
    mapping(uint256 => uint256) tribeRelicCount;      // Relic count per tribe
}

/**
 * @notice Experiment data structure for antigravity verification.
 */
struct ExperimentRecord {
    uint256 liftPercent;    // Basis points (3000 = 30%)
    uint256 peakVoltage;    // kV * 100 (5000 = 50kV)
    bytes32 telemetryHash;  // Keccak256 of full telemetry JSON
    uint256 timestamp;      // Block timestamp
    string metadataURI;     // Final URI (Base64 on-chain or off-chain)
    uint256 adversaryBuffer; // Phase 1: Ubuntu Mercy - Lessons encoded
}

// --- Phase 6: Pi Network Integration Storage ---

/**
 * @notice Pi Payment transaction record.
 */
struct PiPayment {
    bytes32 paymentId;      // Unique payment identifier from Pi Network
    address payer;          // Address that made the payment
    uint256 amount;         // Amount in Pi (wei equivalent)
    uint256 timestamp;      // Block timestamp
    bool claimed;           // Whether rewards have been claimed
    string metadataURI;     // Payment metadata
}

/**
 * @notice KYC verification status for Pi Network identity.
 */
struct KycStatus {
    uint8 level;            // KYC level (0-3: None, Basic, Advanced, Enterprise)
    bool verified;          // Whether KYC is verified
    uint256 verifiedAt;     // Timestamp of verification
    bytes32 piUsernameHash; // Hashed Pi username for privacy
    string documentURI;     // URI to encrypted verification documents
}

/**
 * @notice Game oracle submission for Match-3 results.
 */
struct GameResult {
    bytes32 resultId;       // Unique result identifier
    address player;         // Player address
    uint256 score;          // Match-3 score achieved
    uint256 resonanceGain;  // Calculated resonance gain
    uint256 timestamp;      // Block timestamp
    bool verified;          // Whether result has been verified by oracle
    bytes32 proofHash;      // Proof of valid game session
}

/**
 * @notice Ancestral Relic NFT data.
 */
struct AncestralRelic {
    uint256 relicId;        // Unique relic identifier
    uint256 tribeId;        // Associated tribe (0-12)
    uint256 rarity;         // Rarity level (1-5: Common to Mythic)
    uint256 powerBoost;     // Power boost value
    string metadataURI;     // Relic metadata URI
    bool isActive;          // Whether relic is active/equipped
}

library LibAppStorage {
    function diamondStorage() internal pure returns (AppStorage storage ds) {
        // Hashed Storage Namespace as per v1.4.1 roadmap
        bytes32 position = keccak256("resonant.realms.storage");
        assembly {
            ds.slot := position
        }
    }
}
