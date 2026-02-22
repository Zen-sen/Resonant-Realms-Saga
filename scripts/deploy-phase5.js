const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 PHASE 5 DEPLOYMENT: XITSONGA + RESONANCE CASCADE");
    console.log("=".repeat(60));

    const [deployer] = await ethers.getSigners();
    console.log("👤 Deployer:", deployer.address);

    const diamondAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Localhost default Diamond address
    const FacetCutAction = { Add: 0, Replace: 1, Remove: 2 };

    // --- [1/2] AncestralHeritageFacet ---
    console.log("\n[1/2] Deploying AncestralHeritageFacet...");
    const HeritageFacet = await ethers.getContractFactory("AncestralHeritageFacet");
    const heritageFacet = await HeritageFacet.deploy();
    await heritageFacet.waitForDeployment();
    const heritageAddr = await heritageFacet.getAddress();
    console.log(`✅ New HeritageFacet at: ${heritageAddr}`);

    // --- [2/2] BreedingFacet ---
    console.log("\n[2/2] Deploying BreedingFacet...");
    const BreedingFacet = await ethers.getContractFactory("BreedingFacet");
    const breedingFacet = await BreedingFacet.deploy();
    await breedingFacet.waitForDeployment();
    const breedingAddr = await breedingFacet.getAddress();
    console.log(`✅ New BreedingFacet at: ${breedingAddr}`);

    const cut = [
        {
            facetAddress: heritageAddr,
            action: FacetCutAction.Replace,
            functionSelectors: [
                heritageFacet.interface.getFunction("initializeTribalMatrix").selector,
                heritageFacet.interface.getFunction("setTribe").selector,
                heritageFacet.interface.getFunction("joinTribe").selector,
                heritageFacet.interface.getFunction("selectSynthesisBuff").selector,
                heritageFacet.interface.getFunction("getPlayerStats").selector,
                heritageFacet.interface.getFunction("getTribeCount").selector,
                heritageFacet.interface.getFunction("getTribe").selector,
            ]
        },
        {
            facetAddress: heritageAddr,
            action: FacetCutAction.Add,
            functionSelectors: [
                heritageFacet.interface.getFunction("recordResonanceCascade").selector
            ]
        },
        {
            facetAddress: breedingAddr,
            action: FacetCutAction.Replace,
            functionSelectors: [
                breedingFacet.interface.getFunction("breed").selector,
                breedingFacet.interface.getFunction("getBunny").selector,
                breedingFacet.interface.getFunction("getBunniesByOwner").selector,
                breedingFacet.interface.getFunction("getBreedingCost").selector,
                breedingFacet.interface.getFunction("calculateBreedingCostExtended").selector
            ]
        }
    ];

    const diamondCut = await ethers.getContractAt("contracts/interfaces/IDiamondCut.sol:IDiamondCut", diamondAddress);
    const tx = await diamondCut.diamondCut(cut, ethers.ZeroAddress, "0x");
    await tx.wait();
    console.log("✅ Diamond Cut completed.");

    // --- INITIALIZATION ---
    console.log("\n🌿 Initializing Phase 5 Tribal Matrix...");
    const instance = await ethers.getContractAt("AncestralHeritageFacet", diamondAddress);
    await (await instance.initializeTribalMatrix()).wait();

    console.log("\n🎉 PHASE 5 DEPLOYMENT COMPLETE!");
    console.log(`Diamond Address: ${diamondAddress}`);
}

main().catch(console.error);
