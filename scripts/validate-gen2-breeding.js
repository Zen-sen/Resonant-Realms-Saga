const { ethers } = require("hardhat");

async function main() {
    console.log("🕯️ GENESIS BREATHING VALIDATION: GEN-2 & COSTS");
    console.log("=".repeat(60));

    const [deployer] = await ethers.getSigners();

    // 1. Deploy Diamond with Custom Setup
    const Diamond = await ethers.getContractFactory("Diamond");
    const diamond = await Diamond.deploy(deployer.address);
    await diamond.waitForDeployment();
    const DIAMOND_ADDRESS = await diamond.getAddress();

    const linkFacet = async (name, facetAddress, selectors) => {
        const diamondStone = await ethers.getContractAt("Diamond", DIAMOND_ADDRESS);
        await (await diamondStone.setFacetsBatch(facetAddress, selectors)).wait();
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

    const facetNames = ["AntigravityFacet", "AncestralHeritageFacet", "BunnyFactoryFacet", "BreedingFacet", "MentorshipFacet"];
    for (const name of facetNames) {
        const Facet = await ethers.getContractFactory(name);
        const facet = await Facet.deploy();
        await facet.waitForDeployment();
        await linkFacet(name, await facet.getAddress(), getSelectors(facet));
    }

    const breeding = await ethers.getContractAt("BreedingFacet", DIAMOND_ADDRESS);
    const mentorship = await ethers.getContractAt("MentorshipFacet", DIAMOND_ADDRESS);
    const factory = await ethers.getContractAt("BunnyFactoryFacet", DIAMOND_ADDRESS);
    const heritage = await ethers.getContractAt("AncestralHeritageFacet", DIAMOND_ADDRESS);
    const antigravity = await ethers.getContractAt("AntigravityFacet", DIAMOND_ADDRESS);

    // 2. Setup: Tribes & Experiment (Buffer: 10)
    await heritage.initializeTribalMatrix();
    const telHash = ethers.keccak256(ethers.toUtf8Bytes("validation_test"));
    await antigravity.recordExperiment(3000, 5000, telHash, "uri", 10);
    console.log("✅ Environment Setup complete (Buffer: 10).");

    // 3. Grant Ubuntu Points (Manually via recordAwakening to simulate play)
    // 1000 score -> 1000 UP
    console.log("\n💰 Granting 2000 Ubuntu Points to Architect...");
    await mentorship.recordAwakening(2000);
    let points = await mentorship.getUbuntuPoints(deployer.address);
    console.log(`Balance: ${points.toString()} UP`);

    // 4. Case Cost Test (Base Cost = 1000)
    const currentCost = await breeding.getBreedingCost();
    console.log(`💰 Current Breeding Cost: ${currentCost.toString()} UP`);

    // 5. Execute Gen-2 Crossover
    await factory.breatheSage(BigInt("0x1111222233334444"), 0); // ID 0
    await factory.breatheSage(BigInt("0x5555666677778888"), 0); // ID 1

    console.log("\n🧬 Breeding ID 0 and ID 1...");
    await (await breeding.breed(0, 1)).wait();

    const pointsAfter = await mentorship.getUbuntuPoints(deployer.address);
    console.log(`💰 Balance after breeding: ${pointsAfter.toString()} UP`);

    if (points - pointsAfter !== BigInt(1000)) {
        console.log("❌ ERROR: Cost deduction incorrect!");
    } else {
        console.log("✅ SUCCESS: 1000 UP deducted correctly.");
    }

    const child = await breeding.getBunny(2);
    console.log(`\nVerified Child (ID: 2):`);
    console.log(` - Resonance: ${child.resonance} (Expected: 52 due to Buffer 10, Base 50)`);
    console.log(` - Generation: ${child.generation}`);

    if (child.resonance == BigInt(52)) {
        console.log("✅ SUCCESS: Ubuntu Mercy (Buffer) bonus applied correctly.");
    }

    console.log("\n" + "=".repeat(60));
    console.log("✨ GENESIS BREATHING VALIDATION COMPLETE");
}

main().catch(console.error);
