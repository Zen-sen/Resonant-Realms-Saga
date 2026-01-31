const { ethers } = require("hardhat");

async function main() {
  const DIAMOND_ADDRESS = "0x8198f5d8F8CfFE8f9C413d98a0A55aEB8ab9FbB7";
  
  console.log("🏺 Deploying Diamond Loupe Facet...");
  const Loupe = await ethers.getContractFactory("DiamondLoupeFacet");
  const loupe = await Loupe.deploy();
  await loupe.waitForDeployment();
  const loupeAddress = await loupe.getAddress();
  
  console.log("⚔️ Inscribing Loupe into the Stone at:", loupeAddress);
  
  const stone = await ethers.getContractAt("Diamond", DIAMOND_ADDRESS);
  const selectors = [
    Loupe.interface.getFunction("facetAddress").selector,
    // Add others if implemented, but facetAddress is the key for debugging
  ];

  const tx = await stone.setFacetsBatch(loupeAddress, selectors);
  await tx.wait();

  console.log("✨ SUCCESS: The Stone can now see its own reflection.");
}

main().catch(console.error);
