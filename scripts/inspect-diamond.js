const { ethers } = require("hardhat");

async function main() {
  const diamondAddress = "0xb7f8bc676941091ca24e1955367639537f225d00";
  const loupe = await ethers.getContractAt("DiamondLoupeFacet", diamondAddress);

  console.log("🧐 Inspecting the Stone's Facets...");
  const facetAddresses = await loupe.facetAddresses();

  console.log("Attached Facets:");
  facetAddresses.forEach((addr, i) => {
    console.log("  [" + i + "] " + addr);
  });
}

main().catch(console.error);
