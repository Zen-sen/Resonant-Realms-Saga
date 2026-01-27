const { ethers } = require("hardhat");

async function main() {
    // This is the Diamond Stone address from your successful deployment
    const diamondAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
    const [player] = await ethers.getSigners();

    console.log("--- Resonant Realms: Heritage Verification ---");
    console.log("Connecting to Stone at:", diamondAddress);
    
    // We point the Heritage logic at the Diamond Proxy address
    const heritage = await ethers.getContractAt("AncestralHeritageFacet", diamondAddress);

    // 1. Join the Khoe-San Tribe (Index 0)
    console.log("Action: Joining Khoe-San Tribe (Index 0)...");
    const joinTx = await heritage.joinTribe(0);
    await joinTx.wait();
    console.log("Result: Tribe Joined. Tx:", joinTx.hash);

    // 2. Batch-style Data Retrieval
    // We are pulling the full stats array in one call
    console.log("Action: Retrieving Player Stats...");
    const stats = await heritage.getPlayerStats(player.address);
    
    // stats[0] is tribeId, stats[1] is wisdom
    const tribeId = stats[0].toString();
    const wisdom = stats[1].toString();

    console.log("\n--- Verification Report ---");
    console.log(`Tribe ID: ${tribeId} ${tribeId === "0" ? "(Khoe-San ✅)" : "(Unknown ❌)"}`);
    console.log(`Wisdom:   ${wisdom} Points`);
    console.log("---------------------------");
    
    if(tribeId === "0") {
        console.log("✨ The Ancestral Link is secure.");
    }
}

main().catch((error) => {
    console.error("The ritual failed!");
    console.error(error);
});