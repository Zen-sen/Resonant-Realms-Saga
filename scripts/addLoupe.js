const { ethers } = require("hardhat");

async function main() {
  const diamondAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
  console.log("💎 Target Diamond:", diamondAddress);

  // 1. Deploy Loupe Facet
  const LoupeFacet = await ethers.getContractFactory("DiamondLoupeFacet");
  const loupe = await LoupeFacet.deploy();
  await loupe.waitForDeployment();
  const loupeAddress = await loupe.getAddress();
  console.log("🔍 Loupe Facet deployed to:", loupeAddress);

  // 2. Prepare Selectors for the Loupe
  // We manually list them to ensure they match your Diamond's expectations
  const selectors = [
    ethers.id("facets()").substring(0, 10),
    ethers.id("facetFunctionSelectors(address)").substring(0, 10),
    ethers.id("facetAddresses()").substring(0, 10),
    ethers.id("facetAddress(bytes4)").substring(0, 10)
  ];

  // 3. The Architect's Inscription
  // Use the Diamond contract directly since it has setFacetsBatch
  const diamond = await ethers.getContractAt("Diamond", diamondAddress);
  
  console.log("⚔️ Inscribing Loupe via setFacetsBatch...");
  const tx = await diamond.setFacetsBatch(loupeAddress, selectors);
  await tx.wait();

  console.log("---\n✨ SUCCESS: The Stone now has Eyes (Loupe Active).");
  console.log("📍 LOUPE ADDRESS: " + loupeAddress + "\n---");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
