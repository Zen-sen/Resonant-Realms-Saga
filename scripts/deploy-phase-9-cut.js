const { ethers } = require("hardhat");

/**
 * @title Phase 9: Tribal Seeding Sync
 * @description Synchronizes AncestralHeritageFacet and seeds Zulu/Xhosa.
 */

const DIAMOND_ADDRESS = ethers.getAddress("0xB7f8BC676941091ca24E1955367639537f225D00".toLowerCase());

async function main() {
    console.log("🚀 PHASE 9 SYNC: TRIBAL EVOLUTION");
    console.log("=".repeat(60));

    const [deployer] = await ethers.getSigners();
    console.log("👤 Deployer:", deployer.address);

    const FacetCutAction = { Add: 0, Replace: 1, Remove: 2 };

    // --- [1/1] AncestralHeritageFacet (SYNC) ---
    console.log("\n[1/1] Synchronizing AncestralHeritageFacet...");
    const HeritageFacet = await ethers.getContractFactory("AncestralHeritageFacet");
    const heritageFacet = await HeritageFacet.deploy();
    await heritageFacet.waitForDeployment();
    const heritageAddr = await heritageFacet.getAddress();
    console.log(`✅ New HeritageFacet at: ${heritageAddr}`);

    const selectors = [
        heritageFacet.interface.getFunction("initializeTribalMatrix").selector,
        heritageFacet.interface.getFunction("setTribe").selector,
        heritageFacet.interface.getFunction("joinTribe").selector,
        heritageFacet.interface.getFunction("selectSynthesisBuff").selector,
        heritageFacet.interface.getFunction("getPlayerStats").selector,
        heritageFacet.interface.getFunction("getTribeCount").selector,
        heritageFacet.interface.getFunction("getTribe").selector
    ];

    const cut = [{
        facetAddress: heritageAddr,
        action: FacetCutAction.Replace, // Replacing the facet and adding one new selector
        functionSelectors: selectors
    }];

    const diamondCut = await ethers.getContractAt("DiamondCutFacet", DIAMOND_ADDRESS);
    const tx = await diamondCut.diamondCut(cut, ethers.ZeroAddress, "0x");
    await tx.wait();
    console.log("✅ Diamond Cut completed.");

    // --- SEEDING ---
    console.log("\n🌿 Seeding Zulu and Xhosa physics...");
    const instance = await ethers.getContractAt("AncestralHeritageFacet", DIAMOND_ADDRESS);

    // Zulu (Index 1): High Mass (Lightning), Stability
    console.log(" - Seeding Zulu (Index 1)...");
    await (await instance.setTribe(1, "Zulu", 180, 20)).wait();

    // Xhosa (Index 2): Resonance, Fluidity
    console.log(" - Seeding Xhosa (Index 2)...");
    await (await instance.setTribe(2, "Xhosa", 80, 60)).wait();

    console.log("\n🎉 PHASE 9 SEEDING COMPLETE!");
}

main().catch(console.error);
