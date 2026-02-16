const { ethers } = require("hardhat");

async function main() {
    const DIAMOND_ADDRESS = "0xB7f8BC676941091ca24E1955367639537f225D00";
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

    // 3. Execute DiamondCut
    console.log("\n[2/2] Executing DiamondCut Inscription...");
    const diamondCut = await ethers.getContractAt("IDiamondCut", DIAMOND_ADDRESS);

    const cut = [{
        facetAddress: facetAddress,
        action: 0, // Add
        functionSelectors: selectors
    }];

    try {
        const tx = await diamondCut.diamondCut(cut, ethers.ZeroAddress, "0x");
        await tx.wait();
        console.log("🎉 SUCCESS: BreedingFacet inscribed into the Diamond Stone!");
    } catch (e) {
        console.error("❌ Failed to inscribe facet:", e.message);
        if (e.message.includes("Can't add function that already exists")) {
            console.log("💡 Tip: It seems this facet or some of its functions are already inscribed.");
        }
    }
}

main().catch(console.error);
