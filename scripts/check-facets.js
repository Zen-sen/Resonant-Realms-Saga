const { ethers } = require("hardhat");

async function main() {
  const diamondAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const loupe = await ethers.getContractAt("IDiamondLoupe", diamondAddress);

  const facets = await loupe.facets();
  console.log("--- Diamond Facet Mapping ---");
  
  for (const facet of facets) {
    console.log(`Facet: ${facet.facetAddress}`);
    console.log(`Selectors: ${facet.functionSelectors}\n`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
