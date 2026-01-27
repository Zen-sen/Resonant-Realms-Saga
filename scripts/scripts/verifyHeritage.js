const { ethers } = require("hardhat");

async function main() {
    const diamondAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
    const [player] = await ethers.getSigners();

    console.log("Connecting to the Diamond at:", diamondAddress);
    
    // We use the Facet's ABI but point it to the Diamond's Address
    const heritage = await ethers.getContractAt("AncestralHeritageFacet", diamondAddress);

    console.log("Attempting to join the First Nation (Khoe-San, ID: 0)...");
    
    // Call joinTribe(0)
    const tx = await heritage.joinTribe(0);
    await tx.wait();
    
    console.log("Success! Transaction Hash:", tx.hash);

    // Fetch stats to verify
    const stats = await heritage.getPlayerStats(player.address);
    console.log("\n--- Player Profile ---");
    console.log("Tribe ID:", stats[0].toString()); // Should be 0
    console.log("Wisdom Points:", stats[1].toString());
}

main().catch((error) => {
    console.error("Verification failed:", error);
});