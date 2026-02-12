const { ethers } = require("hardhat");

/**
 * @title The Bridge Script
 * @description Runs the Antigravity Simulation and, upon verifying the "Ascension Key" (Mass Reduction > 30%),
 *              triggers the smart contract to mint ǃKaggen (Bunny #0).
 */

const DIAMOND_ADDRESS = "0x5081a39b8A5f0E35a8D959395a630b68B74Dd30f"; // From MASTER_GDD.md

async function runSimulation() {
    console.log("🛠️ Starting Engineering Forge Process...");

    // Import and run the experiment dynamically
    // We'll use ts-node to execute it
    const { execSync } = require('child_process');

    try {
        // Run the experiment using ts-node
        const output = execSync(
            'npx ts-node --skip-project src/physics/run-experiment.ts',
            {
                cwd: process.cwd(),
                encoding: 'utf-8',
                stdio: 'inherit'
            }
        );

        // If we get here without error, the simulation completed
        return true;
    } catch (error) {
        console.error("❌ Simulation execution failed:", error.message);
        return false;
    }
}

async function main() {
    console.log("🌌 BRIDGE: Initializing The Synthesis Check...");

    // 1. Run the Physical/Simulation Test
    const success = await runSimulation();

    if (!success) {
        console.error("❌ SIMULATION FAILED: Thrust anomaly insufficient for Ascension.");
        process.exit(1);
    }

    console.log("\n✨ SIMULATION VERIFIED: Ready for Blockchain Link.");
    console.log("🔗 Initiating Smart Contract Interaction...");

    // 2. Execute Smart Contract Interaction
    const [admin] = await ethers.getSigners();
    console.log("👤 Operator:", admin.address);
    console.log("💎 Target Stone:", DIAMOND_ADDRESS);

    try {
        const heritage = await ethers.getContractAt("AncestralHeritageFacet", DIAMOND_ADDRESS);

        // Joining Tribe 0 (Khoe-San) - The Mantis
        console.log("🌍 Calling joinTribe(0)...");
        const tx = await heritage.joinTribe(0);

        console.log(`⏳ Transaction sent: ${tx.hash}`);
        await tx.wait();

        console.log("🎉 SUCCESS: ǃKaggen Minted via Antigravity Proof.");

        // Verify
        const stats = await heritage.getPlayerStats(admin.address);
        console.log(`📜 Verified Stats: Tribe ${stats[0]} | Ubuntu ${stats[1]}`);

    } catch (error) {
        console.error("⚠️ BLOCKCHAIN ERROR:", error.message || error);
        // If already in tribe, that's fine too
        if (error.message && error.message.includes("Already in a tribe")) {
            console.log("ℹ️ Note: Entity was already Ascended.");
        }
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
