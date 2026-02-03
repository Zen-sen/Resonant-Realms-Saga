const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("🛠️ Forging the Diamond with account:", deployer.address);

    // 1. Deploy Diamond Stone
    const Diamond = await ethers.getContractFactory("Diamond");
    const diamond = await Diamond.deploy(deployer.address);
    await diamond.waitForDeployment();
    const diamondAddr = await diamond.getAddress();
    console.log("💎 Diamond Stone manifest at:", diamondAddr);

    // 2. Deploy BunnyFactoryFacet
    const Factory = await ethers.getContractFactory("BunnyFactoryFacet");
    const factoryFacet = await Factory.deploy();
    await factoryFacet.waitForDeployment();
    const factoryAddr = await factoryFacet.getAddress();
    console.log("✅ BunnyFactoryFacet deployed at:", factoryAddr);

    // 3. The Diamond Cut (The Ritual of Linking)
    const selectors = [
        factoryFacet.interface.getFunction("mintGenesisBunny").selector,
        factoryFacet.interface.getFunction("getBunnyCount").selector,
        factoryFacet.interface.getFunction("getBunny").selector
    ];

    console.log("✂️ Performing the Diamond Cut (Linking Selectors)...");
    const diamondAsStone = await ethers.getContractAt("Diamond", diamondAddr);
    
    // SWAPPED ORDER: Address first, then Selectors
    // Adjust this to match your Diamond.sol function signature: setFacetsBatch(address, bytes4[])
    const cutTx = await diamondAsStone.setFacetsBatch(factoryAddr, selectors);
    await cutTx.wait();
    console.log("🔗 Selectors successfully linked to BunnyFactoryFacet.");

    // 4. Genesis Breathing Test
    console.log("🌬️ Attempting to manifest ǃKaggen...");
    const diamondAsFactory = await ethers.getContractAt("BunnyFactoryFacet", diamondAddr);
    
    try {
        const mintTx = await diamondAsFactory.mintGenesisBunny(0); // 0 = Khoe-San
        await mintTx.wait();
        const count = await diamondAsFactory.getBunnyCount();
        console.log("✨ ǃKaggen (Bunny #0) has drawn breath! Total Bunnies:", count.toString());
    } catch (error) {
        console.error("❌ Ritual failed:", error.message);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
