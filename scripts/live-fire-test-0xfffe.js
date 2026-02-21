const { ethers } = require("hardhat");

async function main() {
    const DIAMOND_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    console.log("🔥 LIVE-FIRE TEST: 0xFFFE FOUNDATION MASK");
    console.log("=".repeat(60));

    const [deployer] = await ethers.getSigners();
    console.log("👤 Practitioner:", deployer.address);

    const antigravity = await ethers.getContractAt("AntigravityFacet", DIAMOND_ADDRESS);
    const factory = await ethers.getContractAt("BunnyFactoryFacet", DIAMOND_ADDRESS);
    const breeding = await ethers.getContractAt("BreedingFacet", DIAMOND_ADDRESS);
    const mentorship = await ethers.getContractAt("MentorshipFacet", DIAMOND_ADDRESS);

    // 1. Ensure Experiment is recorded (Adversary Buffer > 0)
    const hasThreshold = await antigravity.hasPassedThreshold(deployer.address);
    if (!hasThreshold) {
        console.log("[1/5] Recording Genesis Experiment...");
        const telHash = ethers.keccak256(ethers.toUtf8Bytes("live_fire_" + Date.now()));
        await (await antigravity.recordExperiment(3500, 5000, telHash, "ipfs://test", 255)).wait();
        console.log("✅ Experiment recorded (Buffer: 255).");
    } else {
        console.log("[1/5] Experiment already recorded. Proceeding with existing buffer.");
    }

    // 2. Grant resonance for breeding cost (1000 UP)
    console.log("[2/5] Granting Resonance...");
    await (await mentorship.recordAwakening(2000)).wait();
    console.log(`✅ Balance: ${await mentorship.getUbuntuPoints(deployer.address)} UP.`);

    // 3. Mint Parents with Khoe-San Bit (Bit 0) set
    console.log("[3/5] Minting Khoe-San Parents (Bit 0 = 1)...");
    const genes = 1n; // Bit 0 is set
    await (await factory.breatheSage(genes, 0)).wait();
    const matronId = (await factory.totalSages()) - 1n;
    await (await factory.breatheSage(genes, 0)).wait();
    const sireId = (await factory.totalSages()) - 1n;
    console.log(`✅ Parents: ${matronId} & ${sireId}`);

    // 4. Perform Breeding (Crossover)
    console.log("[4/5] Initiating Genetic Crossover...");
    const breedTx = await breeding.breed(matronId, sireId);
    await breedTx.wait();
    console.log("✅ Gen-2 child manifested.");

    // 5. Final Verification of Invariance
    const childId = (await factory.totalSages()) - 1n;
    const child = await breeding.getBunny(childId);
    const childGenes = BigInt(child.genes);
    const foundationBit = childGenes & 1n;

    console.log("\n[5/5] Final Verification Report:");
    console.log(` - Child ID: ${childId}`);
    console.log(` - Child Genes: 0x${childGenes.toString(16)}`);
    console.log(` - Foundation Bit (Bit 0): ${foundationBit}`);

    if (foundationBit === 1n) {
        console.log("\n🛡️ SUCCESS: The 0xFFFE Mask Held. Foundation Bit 0 remains IMMUTABLE.");
        console.log("✨ The Khoe-San foundation is preserved in the next generation.");
    } else {
        console.error("\n❌ FAILURE: Bit 0 was corrupted! The foundation is lost.");
        process.exit(1);
    }
}

main().catch(console.error);
