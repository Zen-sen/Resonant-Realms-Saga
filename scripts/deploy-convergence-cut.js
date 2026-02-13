const { ethers } = require("hardhat");

/**
 * @title Phase 5 & 6: Convergence & Resonance Inscription
 * @description 
 * 1. Synchronizes AntigravityFacet (buffer logic).
 * 2. Inscribes BreedingFacet (DNA Crossover).
 * 3. Inscribes ResonanceFacet (Match-3 Evolution).
 */

const DIAMOND_ADDRESS = ethers.getAddress("0xB7f8BC676941091ca24E1955367639537f225D00".toLowerCase());

async function main() {
    console.log("🚀 CONVERGENCE INSCRIPTION: PHASES 5 & 6");
    console.log("=".repeat(60));

    const [deployer] = await ethers.getSigners();
    console.log("👤 Deployer:", deployer.address);
    console.log("💎 Target Diamond Stone:", DIAMOND_ADDRESS);

    const FacetCutAction = { Add: 0, Replace: 1, Remove: 2 };
    const cuts = [];

    // --- [1/4] AntigravityFacet (SYNC) ---
    console.log("\n[1/4] Synchronizing AntigravityFacet...");
    const AntigravityFacet = await ethers.getContractFactory("AntigravityFacet");
    const antigravityFacet = await AntigravityFacet.deploy();
    await antigravityFacet.waitForDeployment();
    const antiAddr = await antigravityFacet.getAddress();

    cuts.push({
        facetAddress: antiAddr,
        action: FacetCutAction.Replace,
        functionSelectors: [
            antigravityFacet.interface.getFunction("recordExperiment").selector,
            antigravityFacet.interface.getFunction("hasPassedThreshold").selector,
            antigravityFacet.interface.getFunction("getExperimentData").selector,
            antigravityFacet.interface.getFunction("getThreshold").selector
        ]
    });

    // --- [2/4] AncestralHeritageFacet (SYNC) ---
    console.log("\n[2/4] Synchronizing AncestralHeritageFacet...");
    const AncestralHeritageFacet = await ethers.getContractFactory("AncestralHeritageFacet");
    const ancestralFacet = await AncestralHeritageFacet.deploy();
    await ancestralFacet.waitForDeployment();
    const ancestralAddr = await ancestralFacet.getAddress();

    cuts.push({
        facetAddress: ancestralAddr,
        action: FacetCutAction.Replace,
        functionSelectors: [
            ancestralFacet.interface.getFunction("initializeTribalMatrix").selector,
            ancestralFacet.interface.getFunction("joinTribe").selector,
            ancestralFacet.interface.getFunction("selectSynthesisBuff").selector,
            ancestralFacet.interface.getFunction("getPlayerStats").selector,
            ancestralFacet.interface.getFunction("getTribeCount").selector,
            ancestralFacet.interface.getFunction("getTribe").selector
        ]
    });

    // --- [3/4] BreedingFacet (NEW) ---
    console.log("\n[3/4] Inscribing BreedingFacet...");
    const BreedingFacet = await ethers.getContractFactory("BreedingFacet");
    const breedingFacet = await BreedingFacet.deploy();
    await breedingFacet.waitForDeployment();
    const breedingAddr = await breedingFacet.getAddress();

    cuts.push({
        facetAddress: breedingAddr,
        action: FacetCutAction.Add,
        functionSelectors: [
            breedingFacet.interface.getFunction("breed").selector,
            breedingFacet.interface.getFunction("getBunny").selector,
            breedingFacet.interface.getFunction("getBunniesByOwner").selector
        ]
    });

    // --- [4/4] ResonanceFacet (NEW) ---
    console.log("\n[4/4] Inscribing ResonanceFacet...");
    const ResonanceFacet = await ethers.getContractFactory("ResonanceFacet");
    const resonanceFacet = await ResonanceFacet.deploy();
    await resonanceFacet.waitForDeployment();
    const resonanceAddr = await resonanceFacet.getAddress();

    cuts.push({
        facetAddress: resonanceAddr,
        action: FacetCutAction.Add,
        functionSelectors: [
            resonanceFacet.interface.getFunction("recordResonance").selector,
            resonanceFacet.interface.getFunction("updateEntityPhysics").selector,
            resonanceFacet.interface.getFunction("getEntityPhysics").selector
        ]
    });

    // --- Execute Cut ---
    console.log("\n💎 Executing Diamond Cut...");
    const diamondCut = await ethers.getContractAt("DiamondCutFacet", DIAMOND_ADDRESS);

    try {
        const tx = await diamondCut.diamondCut(
            cuts,
            ethers.ZeroAddress,
            "0x"
        );
        console.log(`⏳ Transaction sent: ${tx.hash}`);
        await tx.wait();
        console.log("🎉 Diamond Stone successfully inscribed.");

    } catch (error) {
        console.error("❌ Inscription failed:", error.message);
        process.exit(1);
    }

    console.log("\n" + "=".repeat(60));
    console.log("✨ CONVERGENCE INSCRIPTION COMPLETE");
    console.log("🧬 The Bloodline and Resonance channels are now open.");
}

main().catch(console.error);
