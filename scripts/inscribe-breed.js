const { ethers } = require("hardhat");

async function main() {
    const DIAMOND_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    console.log("🛠️ INSCRIBING BREEDING FACET INTO DIAMOND AT:", DIAMOND_ADDRESS);

    const [deployer] = await ethers.getSigners();
    console.log("👤 Architect:", deployer.address);

    // 1. Deploy BreedingFacet
    console.log("\n[1/2] Deploying BreedingFacet...");
    const BreedingFacet = await ethers.getContractFactory("BreedingFacet");
    const breedingFacet = await BreedingFacet.deploy();
    await breedingFacet.waitForDeployment();
    const facetAddress = await breedingFacet.getAddress();
    console.log("✅ BreedingFacet deployed at:", facetAddress);

    // 2. Get Selectors
    const selectors = [];
    BreedingFacet.interface.forEachFunction((func) => {
        selectors.push(func.selector);
    });
    console.log(`🔍 Found ${selectors.length} selectors.`);

    // 3. Execute Architect Inscription (setFacetsBatch)
    console.log("\n[2/2] Executing Architect Inscription...");
    const diamond = await ethers.getContractAt("Diamond", DIAMOND_ADDRESS);

    try {
        const tx = await diamond.setFacetsBatch(facetAddress, selectors);
        await tx.wait();
        console.log("🎉 SUCCESS: BreedingFacet inscribed into the Diamond Stone!");
    } catch (e) {
        console.error("❌ Failed to inscribe facet:", e.message);
    }
}

main().catch(console.error);
