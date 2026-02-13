const { ethers } = require("hardhat");

/**
 * @title Phase 9: The First Birth
 * @description Mints two Gen-0 parents and performs the first Gen-2 breeding.
 */

const DIAMOND_ADDRESS = ethers.getAddress("0xB7f8BC676941091ca24E1955367639537f225D00".toLowerCase());

async function main() {
    console.log("🧬 EXECUTING THE FIRST BIRTH: GEN-2 DESCENT");
    console.log("=".repeat(60));

    const [deployer] = await ethers.getSigners();
    console.log("👤 Architect:", deployer.address);

    const factory = await ethers.getContractAt("BunnyFactoryFacet", DIAMOND_ADDRESS);
    const breeding = await ethers.getContractAt("BreedingFacet", DIAMOND_ADDRESS);

    // --- 1. MINT MATRON ---
    console.log("\n[1/4] Breathing Matron (Tribe 0)...");
    const matronGenes = "0xAAAAAAAABBBBBBBB" + "0".repeat(48); // High density genes
    try {
        const tx1 = await factory.breatheSage(BigInt(matronGenes), 0);
        await tx1.wait();
        console.log("✅ Matron breathed.");
    } catch (e) {
        console.warn("⚠️ Parent might already exist or experiment not recorded for this address.");
        console.error(e.message);
    }

    // --- 2. MINT SIRE ---
    console.log("\n[2/4] Breathing Sire (Tribe 0)...");
    const sireGenes = "0xCCCCCCCCDDDDDDDD" + "0".repeat(48);
    const tx2 = await factory.breatheSage(BigInt(sireGenes), 0);
    await tx2.wait();
    console.log("✅ Sire breathed.");

    const total = await factory.totalSages();
    const matronId = total - 2n;
    const sireId = total - 1n;
    console.log(`Parents IDs: Matron=${matronId}, Sire=${sireId}`);

    // --- 3. BREED ---
    console.log("\n[3/4] Performing Bitwise Crossover (The Convergence)...");
    // Ensure sufficient time has passed (no cooldown for gen-0 usually, but script checks cooldownEnd)
    const breedTx = await breeding.breed(matronId, sireId);
    await breedTx.wait();
    console.log("🎉 SUCCESS: Gen-2 Descendant Manifested!");

    // --- 4. VERIFY ---
    const childId = await factory.totalSages() - 1n;
    const child = await breeding.getBunny(childId);
    console.log("\n[4/4] Verification Report:");
    console.log(` - ID: ${childId}`);
    console.log(` - Generation: ${child.generation}`);
    console.log(` - Start Resonance: ${child.resonance}`);
    console.log(` - Genes: ${child.genes.toString(16)}`);
    console.log(` - Parents: ${child.matronId} & ${child.sireId}`);

    if (child.resonance > 50) {
        console.log(`✨ UBUNTU MERCY DETECTED: Inherited +${child.resonance - 50n} resilience from Ancestral Buffer.`);
    }
}

main().catch(console.error);
