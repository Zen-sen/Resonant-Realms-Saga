const { ethers } = require("hardhat");

async function main() {
  const DIAMOND_ADDRESS = "0x9E545E3C0baAB3E08CdfD552C960A1050f373042";
  const HERITAGE_FACET = "0xa82fF9aFd8f496c3d6ac40E2a0F282E47488CFc9";

  const [deployer] = await ethers.getSigners();
  const diamond = await ethers.getContractAt("Diamond", DIAMOND_ADDRESS);

  console.log("🧐 Probing the Diamond Stone...");

  // These are the exact selectors for AncestralHeritageFacet
  const selectors = [
    "0x30663456", // joinTribe(uint256)
    "0x56a64010"  // getPlayerStats(address)
  ];

  console.log("⚔️ Re-applying the Architect's Key...");
  const tx = await diamond.setFacetsBatch(selectors, HERITAGE_FACET);
  await tx.wait();
  
  console.log("✅ Selectors should now be linked.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});