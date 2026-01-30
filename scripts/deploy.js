const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("⚒️ Staging the Forge with account:", deployer.address);

  // 1. Deploy the Diamond Stone (The Proxy)
  // Your Diamond.sol constructor takes: address _contractOwner
  const Diamond = await ethers.getContractFactory("Diamond");
  const diamond = await Diamond.deploy(deployer.address); 
  await diamond.waitForDeployment();
  const diamondAddress = await diamond.getAddress();
  console.log("💎 Diamond Stone manifested at:", diamondAddress);

  // 2. Deploy Ancestral Heritage Facet (The Logic)
  const HeritageFacet = await ethers.getContractFactory("AncestralHeritageFacet");
  const heritageFacet = await HeritageFacet.deploy();
  await heritageFacet.waitForDeployment();
  const heritageAddress = await heritageFacet.getAddress();
  console.log("🏺 Ancestral Heritage Facet manifested at:", heritageAddress);

  // 3. The Ritual of Batch Registration
  // We call your unique 'setFacetsBatch' function directly
  console.log("⚔️ Architect is activating the Integration Layer...");

  // Selectors for joinTribe(uint256) and getPlayerStats(address)
  const selectors = ["0x30663456", "0x56a64010"]; 

  // Use the Diamond's own ABI to call setFacetsBatch
  const architect = await ethers.getContractAt("Diamond", diamondAddress);
  
  // This is the move that unlocks the stone using your custom logic
  const tx = await architect.setFacetsBatch(selectors, heritageAddress);
  await tx.wait();

  console.log("---");
  console.log("✨ SUCCESS: The Trust Node is fully integrated.");
  console.log("📍 FINAL DIAMOND ADDRESS:", diamondAddress);
  console.log("📍 LOGIC FACET LINKED:", heritageAddress);
  console.log("---");
}

main().catch((error) => {
  console.error("❌ Forge Failure:", error);
  process.exitCode = 1;
});