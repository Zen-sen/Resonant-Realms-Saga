import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("--- Starting Full Ritual: Resonant Realms Foundation ---");
    console.log("Deploying with account (The Architect):", deployer.address);

    // 1. Deploy Diamond Stone
    const Diamond = await ethers.getContractFactory("Diamond");
    console.log("Deploying Diamond Stone...");
    const diamond = await Diamond.deploy(deployer.address); 
    await diamond.waitForDeployment();
    const diamondAddress = await diamond.getAddress();
    console.log("1. Diamond Stone at:", diamondAddress);

    // 2. Deploy Facets
    const HeritageFacet = await ethers.getContractFactory("AncestralHeritageFacet");
    const heritageFacet = await HeritageFacet.deploy();
    await heritageFacet.waitForDeployment();
    const heritageAddress = await heritageFacet.getAddress();
    console.log("2. AncestralHeritageFacet at:", heritageAddress);

    const FactoryFacet = await ethers.getContractFactory("BunnyFactoryFacet");
    const factoryFacet = await FactoryFacet.deploy();
    await factoryFacet.waitForDeployment();
    const factoryAddress = await factoryFacet.getAddress();
    console.log("3. BunnyFactoryFacet at:", factoryAddress);

    // 3. Linking Ritual (Linking Heritage)
    console.log("Linking Ancestral Logic...");
    
    const functionNames = [
        "joinTribe",
        "selectSynthesisBridge",
        "earnWisdom",
        "getPlayerStats",
        "setTribe"
    ];

    const heritageSelectors = functionNames.map(name => {
        const func = heritageFacet.interface.getFunction(name);
        if (!func) {
            throw new Error(`CRITICAL: Function "${name}" not found in AncestralHeritageFacet. Check for typos!`);
        }
        return func.selector;
    });

    await (await diamond.setFacetsBatch(heritageSelectors, heritageAddress)).wait();

    // 4. Linking Ritual (Linking Factory)
    console.log("Linking Factory Logic...");
    const factorySelectors = [
        factoryFacet.interface.getFunction("createGenesisBunny").selector
    ];
    await (await diamond.setFacetsBatch(factorySelectors, factoryAddress)).wait();

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