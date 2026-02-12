const { ethers } = require("hardhat");

/**
 * @title Diamond Cut: Antigravity Facet Deployment
 * @description Adds AntigravityFacet to the existing Diamond Standard deployment.
 * 
 * This adds the following functions:
 * - recordExperiment(uint256, uint256, bytes32)
 * - hasPassedThreshold(address)
 * - getExperimentData(address)
 * - getThreshold()
 */

const DIAMOND_ADDRESS = "0x5081a39b8A5f0E35a8D959395a630b68B74Dd30f"; // From MASTER_GDD.md

async function main() {
    console.log("💎 DIAMOND CUT: Antigravity Facet Integration");
    console.log("=".repeat(60));

    const [deployer] = await ethers.getSigners();
    console.log("👤 Deployer:", deployer.address);
    console.log("💎 Target Diamond:", DIAMOND_ADDRESS);

    // Step 1: Deploy new facet
    console.log("\n[1/3] Deploying AntigravityFacet...");
    const AntigravityFacet = await ethers.getContractFactory("AntigravityFacet");
    const antigravityFacet = await AntigravityFacet.deploy();
    await antigravityFacet.waitForDeployment();

    const facetAddress = await antigravityFacet.getAddress();
    console.log(`✅ AntigravityFacet deployed to: ${facetAddress}`);

    // Step 2: Prepare function selectors
    console.log("\n[2/3] Generating function selectors...");
    const selectors = [
        antigravityFacet.interface.getFunction("recordExperiment").selector,
        antigravityFacet.interface.getFunction("hasPassedThreshold").selector,
        antigravityFacet.interface.getFunction("getExperimentData").selector,
        antigravityFacet.interface.getFunction("getThreshold").selector
    ];

    console.log("Function selectors:");
    selectors.forEach((sel, i) => {
        console.log(`   ${i + 1}. ${sel}`);
    });

    // Step 3: Execute Diamond Cut
    console.log("\n[3/3] Executing Diamond Cut (FacetCutAction.Add)...");

    const diamondCut = await ethers.getContractAt("DiamondCutFacet", DIAMOND_ADDRESS);

    const FacetCutAction = { Add: 0, Replace: 1, Remove: 2 };

    const cut = [{
        facetAddress: facetAddress,
        action: FacetCutAction.Add,
        functionSelectors: selectors
    }];

    try {
        const tx = await diamondCut.diamondCut(
            cut,
            ethers.ZeroAddress, // No init function
            "0x" // No init data
        );

        console.log(`⏳ Transaction sent: ${tx.hash}`);
        await tx.wait();

        console.log("✅ Diamond Cut executed successfully!");

        // Verify
        console.log("\n🔍 Verifying integration...");
        const antigravityInstance = await ethers.getContractAt("AntigravityFacet", DIAMOND_ADDRESS);
        const threshold = await antigravityInstance.getThreshold();
        console.log(`✅ Threshold query successful: ${threshold} basis points (${threshold / 100}%)`);

        console.log("\n" + "=".repeat(60));
        console.log("🎉 ANTIGRAVITY FACET INTEGRATED!");
        console.log("🔗 Diamond now supports experiment recording.");
        console.log("🧬 Ready for Genesis Experiment minting.");

    } catch (error) {
        console.error("❌ Diamond Cut failed:", error.message);
        process.exit(1);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
