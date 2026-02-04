const { ethers } = require("hardhat");

async function main() {
  const diamondAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 
  const [deployer] = await ethers.getSigners();

  console.log("\n⚒️ --- Mapping the Ancestral Bridge --- ⚒️");

  // 1. Deploy the Heritage logic
  const Heritage = await ethers.getContractFactory("AncestralHeritageFacet");
  const heritage = await Heritage.deploy();
  await heritage.waitForDeployment();
  
  // FIXED LINE 13: Clean assignment
  const heritageAddr = await heritage.getAddress();
  console.log("✅ AncestralHeritageFacet deployed at:", heritageAddr);

  // 2. Precise Function Selectors
  const selectors = [
    ethers.id("getPlayerStats(address)").substring(0, 10),
    ethers.id("getTribe(uint256)").substring(0, 10),
    ethers.id("getTribeCount()").substring(0, 10),
    ethers.id("initializeTribalMatrix()").substring(0, 10),
    ethers.id("joinTribe(uint256)").substring(0, 10),
    ethers.id("selectSynthesisBuff(uint256)").substring(0, 10)
  ];

  console.log("🔍 Registering Selectors:", selectors);

  // 3. Inscribe into the Stone
  // Using the Diamond's ABI to access setFacetsBatch
  const diamond = await ethers.getContractAt("Diamond", diamondAddress, deployer);
  
  console.log("⚔️ Calling setFacetsBatch...");
  const tx = await diamond.setFacetsBatch(heritageAddr, selectors);
  await tx.wait();

  console.log("✨ SUCCESS: The Stone now possesses Tribal Wisdom.");
}

main().catch(console.error);