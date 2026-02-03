const { ethers } = require("hardhat");

async function main() {
  const diamondAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const loupe = await ethers.getContractAt("DiamondLoupeFacet", diamondAddress);

  console.log("🧐 Inspecting the Stone's Facets...");
  const facetAddresses = await loupe.facetAddresses();
  
  console.log("Attached Facets:");
  facetAddresses.forEach((addr, i) => {
    console.log("  [" + i + "] " + addr);
  });
}

main().catch(console.error);
