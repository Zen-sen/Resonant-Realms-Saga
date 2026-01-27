import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("--- Starting Full Ritual: Resonant Realms Foundation ---");
    console.log("Deploying with account (The Architect):", deployer.address);

    // 1. Deploy Diamond Stone
    // If your Diamond.sol constructor is: constructor(address _owner)
    const Diamond = await ethers.getContractFactory("Diamond");
    console.log("Deploying Diamond Stone...");
    
    // FIX: Only pass the owner address. Do NOT pass the CutFacet address here 
    // unless your Diamond.sol constructor specifically asks for two arguments.
    const diamond = await Diamond.deploy(deployer.address); 
    
    await diamond.waitForDeployment();
    const diamondAddress = await diamond.getAddress();
    console.log("1. Diamond Stone at:", diamondAddress);

    // 2. Deploy AncestralHeritageFacet
    const HeritageFacet = await ethers.getContractFactory("AncestralHeritageFacet");
    const heritageFacet = await HeritageFacet.deploy();
    await heritageFacet.waitForDeployment();
    const facetAddress = await heritageFacet.getAddress();
    console.log("2. AncestralHeritageFacet at:", facetAddress);

    // 3. Link Logic (The Fusing)
    console.log("Linking Ancestral Logic via setFacetsBatch...");
    
    const selectors = [
        heritageFacet.interface.getFunction("joinTribe").selector,
        heritageFacet.interface.getFunction("selectSynthesisBridge").selector,
        heritageFacet.interface.getFunction("earnWisdom").selector,
        heritageFacet.interface.getFunction("getPlayerStats").selector,
        heritageFacet.interface.getFunction("setTribe").selector 
    ];

    const tx = await diamond.setFacetsBatch(selectors, facetAddress);
    await tx.wait();

    console.log("\n✨ BATCH DEPLOYMENT COMPLETE ✨");
    console.log("==================================================");
    console.log("NEW_DIAMOND_STONE_ADDRESS:", diamondAddress);
    console.log("==================================================");
}

main().catch((error) => {
    console.error("The ritual failed!");
    console.error(error);
    process.exitCode = 1;
});