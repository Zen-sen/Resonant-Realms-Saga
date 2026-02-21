const { ethers } = require("hardhat");

async function main() {
    console.log("🧘 Resonant Realms: Sovereignty Verification (Node.js)");
    console.log("=".repeat(50));

    const DIAMOND_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    // We can use any facet to get basic info, or just the BreedingFacet for getBunny
    const breeding = await ethers.getContractAt("BreedingFacet", DIAMOND_ADDRESS);
    const factory = await ethers.getContractAt("BunnyFactoryFacet", DIAMOND_ADDRESS);

    let total;
    try {
        total = await factory.totalSages();
        console.log(`Connected to Diamond at: ${DIAMOND_ADDRESS}`);
        console.log(`Total Sages manifested: ${total}`);
    } catch (e) {
        console.error(`❌ Error connecting to node: ${e.message}`);
        process.exit(1);
    }

    if (total === 0n) {
        console.log("ℹ️ No sages manifested in the Diamond yet.");
        return;
    }

    const checkCount = total > 5n ? 5n : total;
    console.log(`🔍 Analyzing last ${checkCount} Sage(s) for Foundation Integrity...`);

    let secure = true;
    for (let i = total - checkCount; i < total; i++) {
        const bunny = await breeding.getBunny(i);
        const genes = BigInt(bunny.genes);

        // Khoe-San Foundation Rule: Bit 0 must be 1
        const foundationBit = genes & 1n;
        const status = foundationBit === 1n ? "SECURE" : "CORRUPT";

        console.log(`  [ID ${i}] Genes: 0x${genes.toString(16).slice(0, 16)}... | Bit 0: ${foundationBit} | ${status}`);

        if (foundationBit !== 1n) {
            secure = false;
        }
    }

    console.log("-".repeat(50));
    if (secure) {
        console.log("✅ FOUNDATION SECURE");
    } else {
        console.log("⚠️ SOVEREIGNTY BREACHED: Found corrupted foundation bit!");
        process.exit(1);
    }
}

main().catch(console.error);
