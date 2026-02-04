const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("⚒️ Sovereign Forge: Manifesting the Resonant Stone...");

  // 1. Deploy the Diamond (The Stone)
  // Your constructor ONLY takes the owner address
  const Diamond = await ethers.getContractFactory("Diamond");
  const diamond = await Diamond.deploy(deployer.address);
  await diamond.waitForDeployment();
  const diamondAddress = await diamond.getAddress();
  console.log("💎 NEW SOVEREIGN STONE:", diamondAddress);

  // 2. Deploy HumanFactoryFacet (The Life Logic)
  const Factory = await ethers.getContractFactory("HumanFactoryFacet");
  const factory = await Factory.deploy();
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log("🏺 Factory logic at:", factoryAddress);

  // 3. THE ARCHITECT'S INSCRIPTION
  // We use your custom 'setFacetsBatch' method instead of diamondCut
  console.log("⚔️ Inscribing Tribal Wisdom via setFacetsBatch...");
  
  const selectors = [
    ethers.id("mintGenesisHuman(uint256)").substring(0, 10),
    ethers.id("getHuman(uint256)").substring(0, 10),
    ethers.id("getHumanCount()").substring(0, 10),
    ethers.id("getHumanPower(uint256)").substring(0, 10)
  ];

  // Call setFacetsBatch on the Diamond address
  const tx = await diamond.setFacetsBatch(factoryAddress, selectors);
  await tx.wait();

  console.log("---\n✨ SUCCESS: The Stone is fully operational.\n📍 ADDRESS: " + diamondAddress + "\n---");
}

main().catch(console.error);
