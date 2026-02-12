const { ethers } = require("hardhat");

/**
 * @title Phase 7: Alpha Launch Deployment & Synchronization
 * @description 
 * 1. Deploys and Adds AntigravityFacet (new 4-param signature).
 * 2. Deploys and Replaces AncestralHeritageFacet (event logic update).
 */

const DIAMOND_ADDRESS = "0x5081a39b8A5f0E35a8D959395a630b68B74Dd30f";

async function main() {
    console.log("🚀 PHASE 7: ALPHA LAUNCH SINCHRONIZATION");
    console.log("=".repeat(60));

    const [deployer] = await ethers.getSigners();
    console.log("👤 Deployer:", deployer.address);
    console.log("💎 Target Diamond:", DIAMOND_ADDRESS);

    const FacetCutAction = { Add: 0, Replace: 1, Remove: 2 };
    const cuts = [];

    // --- [1/2] AntigravityFacet (NEW) ---
    console.log("\n[1/2] Deploying AntigravityFacet...");
    const AntigravityFacet = await ethers.getContractFactory("AntigravityFacet");
    const antigravityFacet = await AntigravityFacet.deploy();
    await antigravityFacet.waitForDeployment();
    const antiAddr = await antigravityFacet.getAddress();
    console.log(`✅ AntigravityFacet deployed: ${antiAddr}`);

    const antiSelectors = [
        antigravityFacet.interface.getFunction("recordExperiment").selector,
        antigravityFacet.interface.getFunction("hasPassedThreshold").selector,
        antigravityFacet.interface.getFunction("getExperimentData").selector,
        antigravityFacet.interface.getFunction("getThreshold").selector
    ];

    cuts.push({
        facetAddress: antiAddr,
        action: FacetCutAction.Add,
        functionSelectors: antiSelectors
    });

    // --- [2/2] AncestralHeritageFacet (REPLACE) ---
    console.log("\n[2/2] Deploying updated AncestralHeritageFacet...");
    const AncestralHeritageFacet = await ethers.getContractFactory("AncestralHeritageFacet");
    const ancestralFacet = await AncestralHeritageFacet.deploy();
    await ancestralFacet.waitForDeployment();
    const ancestralAddr = await ancestralFacet.getAddress();
    console.log(`✅ AncestralHeritageFacet deployed: ${ancestralAddr}`);

    const ancestralSelectors = [
        ancestralFacet.interface.getFunction("initializeTribalMatrix").selector,
        ancestralFacet.interface.getFunction("joinTribe").selector,
        ancestralFacet.interface.getFunction("selectSynthesisBuff").selector,
        ancestralFacet.interface.getFunction("getPlayerStats").selector,
        ancestralFacet.interface.getFunction("getTribeCount").selector,
        ancestralFacet.interface.getFunction("getTribe").selector
    ];

    cuts.push({
        facetAddress: ancestralAddr,
        action: FacetCutAction.Replace,
        functionSelectors: ancestralSelectors
    });

    // --- Execute Cut ---
    console.log("\n💎 Executing Unified Diamond Cut...");
    const diamondCut = await ethers.getContractAt("DiamondCutFacet", DIAMOND_ADDRESS);

    try {
        const tx = await diamondCut.diamondCut(
            cuts,
            ethers.ZeroAddress,
            "0x"
        );
        console.log(`⏳ Transaction sent: ${tx.hash}`);
        await tx.wait();
        console.log("🎉 Diamond Cut executed successfully!");

        // Initialize tribes if needed (safe to call multiple times as per current contract logic)
        console.log("\n🌿 Initializing Tribal Matrix...");
        const heritage = await ethers.getContractAt("AncestralHeritageFacet", DIAMOND_ADDRESS);
        const initTx = await heritage.initializeTribalMatrix();
        await initTx.wait();
        console.log("✅ Tribal Matrix synchronized.");

    } catch (error) {
        console.error("❌ Cut failed:", error.message);
        if (error.message.includes("Selector already added")) {
            console.log("⚠️ One or more selectors were already 'Add'ed. Consider using Replace or check diamond-loupe.");
        }
        process.exit(1);
    }

    console.log("\n" + "=".repeat(60));
    console.log("✨ PHASE 7 SYNC COMPLETE");
    console.log("🧬 The Integration Layer is now structural.");
}

main().catch(console.error);
