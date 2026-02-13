const { ethers } = require("hardhat");

/**
 * @title verify-sovereignty.js
 * @description Pulls experiment metadata from the Diamond and re-verifies the telemetry hash.
 * 
 * Usage: npx hardhat run scripts/verify-sovereignty.js --network <network> [playerAddress]
 */

async function main() {
    const DIAMOND_ADDRESS = ethers.getAddress("0xB7f8BC676941091ca24E1955367639537f225D00".toLowerCase());

    // Get player address from args or signers
    const playerAddress = process.argv[2] || (await ethers.getSigners())[0].address;
    console.log(`\n🔍 Verifying Sovereignty for: ${playerAddress}`);

    const antigravityFacet = await ethers.getContractAt("AntigravityFacet", DIAMOND_ADDRESS);

    try {
        console.log("📡 Querying on-chain record...");
        const [liftPercent, peakVoltage, telemetryHash, timestamp, metadataURI, adversaryBuffer] =
            await antigravityFacet.getExperimentData(playerAddress);

        if (timestamp == 0) {
            console.error("❌ No experiment record found for this address.");
            return;
        }

        console.log(`✅ Lift: ${(Number(liftPercent) / 100).toFixed(2)}%`);
        console.log(`✅ Voltage: ${(Number(peakVoltage) / 100).toFixed(2)}kV`);
        console.log(`✅ Buffer: ${adversaryBuffer} Lessons`);
        console.log(`✅ On-chain Hash: ${telemetryHash}`);

        // 1. Decode Metadata URI
        if (!metadataURI.startsWith("data:application/json;base64,")) {
            console.error("❌ Invalid metadata format. Expected Base64 Data URI.");
            return;
        }

        const base64Data = metadataURI.split(",")[1];
        const jsonString = Buffer.from(base64Data, "base64").toString("utf-8");
        const metadata = JSON.parse(jsonString);

        console.log("\n📦 Metadata Decoded:");
        console.log(`   Name: ${metadata.name}`);
        console.log(`   Description: ${metadata.description.substring(0, 50)}...`);

        // 2. Re-calculate Telemetry Hash
        // Note: We must stringify the telemetry exactly as the generator did.
        const telemetryJSON = JSON.stringify(metadata.telemetry);
        const calculatedHash = ethers.keccak256(ethers.toUtf8Bytes(telemetryJSON));

        console.log(`\n🧮 Calculated Hash: ${calculatedHash}`);

        // 3. Compare Result
        if (calculatedHash === telemetryHash) {
            console.log("\n✨ SOVEREIGN PROOF VERIFIED: Telemetry matches the on-chain record.");
            console.log("   The vessel remains stable. Ritual integrity confirmed. 🧘‍♂️");
        } else {
            console.error("\n🚨 SOVEREIGN PROOF FAILURE: Telemetry hash mismatch!");
            console.log("   Calculated hash does not match the on-chain consensus.");
        }

    } catch (error) {
        console.error("❌ Verification failed:", error.message);
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
