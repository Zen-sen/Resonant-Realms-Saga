const { ethers } = require("hardhat");

async function main() {
    const DIAMOND_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    console.log("🛠️  SYNCING DIAMOND FACETS AT:", DIAMOND_ADDRESS);

    const [deployer] = await ethers.getSigners();
    console.log("👤 Architect:", deployer.address);

    const diamond = await ethers.getContractAt("Diamond", DIAMOND_ADDRESS);

    const syncFacet = async (name) => {
        console.log(`\n[Syncing] ${name}...`);
        const Facet = await ethers.getContractFactory(name);
        const facet = await Facet.deploy();
        await facet.waitForDeployment();
        const facetAddress = await facet.getAddress();
        console.log(`✅ ${name} deployed at:`, facetAddress);

        const selectors = [];
        Facet.interface.forEachFunction((func) => {
            selectors.push(func.selector);
        });

        const tx = await diamond.setFacetsBatch(facetAddress, selectors);
        await tx.wait();
        console.log(`🎉 ${name} inscribed.`);
    };

    const facetsToSync = [
        "AntigravityFacet",
        "BunnyFactoryFacet",
        "MentorshipFacet"
    ];

    for (const name of facetsToSync) {
        try {
            await syncFacet(name);
        } catch (e) {
            console.error(`❌ Failed to sync ${name}:`, e.message);
        }
    }

    console.log("\n✨ Diamond Synchronization Complete.");
}

main().catch(console.error);
