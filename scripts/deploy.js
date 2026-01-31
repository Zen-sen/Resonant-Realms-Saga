const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("⚒️ Sovereign Forge: Manifesting the Stone...");

  // 1. Deploy Logic Facets
  const Heritage = await ethers.getContractFactory("AncestralHeritageFacet");
  const heritage = await Heritage.deploy();
  await heritage.waitForDeployment();
  const heritageAddress = await heritage.getAddress();

  const Factory = await ethers.getContractFactory("BunnyFactoryFacet");
  const factory = await Factory.deploy();
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();

  console.log("🏺 Heritage logic at:", heritageAddress);
  console.log("🏺 Factory logic at:", factoryAddress);

  // 2. Deploy the Stone (Diamond Proxy)
  const Diamond = await ethers.getContractFactory("Diamond");
  const diamond = await Diamond.deploy(deployer.address);
  await diamond.waitForDeployment();
  const diamondAddress = await diamond.getAddress();
  console.log("💎 NEW SOVEREIGN STONE:", diamondAddress);

  // 3. Complete Inscription
  const stone = await ethers.getContractAt("Diamond", diamondAddress);

  console.log("⚔️ Inscribing all facets into the Stone...");

  const heritageSelectors = [
    heritage.interface.getFunction("initializeTribalMatrix").selector,
    heritage.interface.getFunction("joinTribe").selector,
    heritage.interface.getFunction("getPlayerStats").selector,
    heritage.interface.getFunction("getTribeCount").selector // <--- THE MISSING LINK
  ];

  const factorySelectors = [
    factory.interface.getFunction("mintGenesisBunny").selector,
    factory.interface.getFunction("getBunny").selector
  ];

  await stone.setFacetsBatch(heritageAddress, heritageSelectors);
  await stone.setFacetsBatch(factoryAddress, factorySelectors);

  console.log("---");
  console.log("✨ SUCCESS: The Stone is fully operational.");
  console.log("📍 NEW DIAMOND ADDRESS:", diamondAddress);
  console.log("---");
}

main().catch(console.error);
