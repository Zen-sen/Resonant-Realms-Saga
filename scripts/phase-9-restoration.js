const { ethers } = require("hardhat");

/**
 * @title Phase 9 Ritual Restoration
 * @description Restores the entire Diamond Stone stack for the Phase 9 Convergence.
 */

async function main() {
    console.log("🕯️ THE RITUAL OF RESTORATION: PHASE 9");
    console.log("=".repeat(60));

    const [deployer] = await ethers.getSigners();
    console.log("👤 Architect:", deployer.address);

    // 1. Deploy Diamond
    const Diamond = await ethers.getContractFactory("Diamond");
    const diamond = await Diamond.deploy(deployer.address);
    await diamond.waitForDeployment();
    const DIAMOND_ADDRESS = await diamond.getAddress();
    console.log("💎 Diamond Stone at:", DIAMOND_ADDRESS);

    const linkFacet = async (name, facetAddress, selectors) => {
        console.log(`🔗 Linking ${name}...`);
        const tx = await diamond.setFacetsBatch(facetAddress, selectors);
        await tx.wait();
    };

    const getSelectors = (contract) => {
        const selectors = [];
        contract.interface.forEachFunction((func) => {
            if (func.name !== "setFacetsBatch" && func.name !== "fallback" && func.name !== "receive") {
                selectors.push(func.selector);
            }
        });
        return selectors;
    };

    // 2. Deploy and Link Facets
    const facetNames = [
        "DiamondLoupeFacet",
        "AntigravityFacet",
        "AncestralHeritageFacet",
        "BunnyFactoryFacet",
        "BreedingFacet",
        "ResonanceFacet"
    ];

    for (const name of facetNames) {
        const Facet = await ethers.getContractFactory(name);
        const facet = await Facet.deploy();
        await facet.waitForDeployment();
        const addr = await facet.getAddress();
        const selectors = getSelectors(facet);
        await linkFacet(name, addr, selectors);
    }

    // 3. Initialize Tribes
    console.log("\n🌿 Initializing Heritage Matrix...");
    const heritage = await ethers.getContractAt("AncestralHeritageFacet", DIAMOND_ADDRESS);
    await (await heritage.initializeTribalMatrix()).wait();

    // Seed Zulu/Xhosa
    await (await heritage.setTribe(1, "Zulu", 180, 20)).wait();
    await (await heritage.setTribe(2, "Xhosa", 80, 60)).wait();
    console.log("✅ Tribes Seeded.");

    // 4. Record Genesis Ritual for Architect
    console.log("\n🧘 Recording Architect's Genesis Ritual (Proven Understanding)...");
    const antigravity = await ethers.getContractAt("AntigravityFacet", DIAMOND_ADDRESS);
    const telemetryHash = ethers.keccak256(ethers.toUtf8Bytes("architect_restoration_v1"));
    await (await antigravity.recordExperiment(3500, 5500, telemetryHash, "data:application/json;base64,eyJuYW1lIjogIkFyY2hpdGVjdCBSaXR1YWwiLCAiZGVzY3JpcHRpb24iOiAiUmVzdG9yZWQgRW52aXJvbm1lbnQifQ==", 5)).wait();
    console.log("✅ Experiment recorded (Buffer: 5).");

    // 5. Execute First Birth
    console.log("\n🧬 Executing The First Birth...");
    const factory = await ethers.getContractAt("BunnyFactoryFacet", DIAMOND_ADDRESS);
    const breeding = await ethers.getContractAt("BreedingFacet", DIAMOND_ADDRESS);

    // Mint Matron & Sire
    await (await factory.breatheSage(BigInt("0xAAAAAAAABBBBBBBB"), 0)).wait();
    await (await factory.breatheSage(BigInt("0xCCCCCCCCDDDDDDDD"), 0)).wait();

    // Breed
    await (await breeding.breed(0, 1)).wait();
    console.log("🎉 SUCCESS: Gen-2 Descendant Manifested!");

    const child = await breeding.getBunny(2);
    console.log(`\nVerified Child (ID: 2):`);
    console.log(` - Resonance: ${child.resonance} (Should be 51 due to Buffer 5)`);
    console.log(` - Generation: ${child.generation}`);

    console.log("\n" + "=".repeat(60));
    console.log("✨ PHASE 9 RESTORATION & CONVERGENCE COMPLETE");
    console.log("NEW_DIAMOND_ADDRESS:", DIAMOND_ADDRESS);
}

main().catch(console.error);
