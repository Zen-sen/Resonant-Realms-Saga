const { ethers } = require("hardhat");

async function main() {
  const diamondAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  
  console.log("--- Deploying the Primary Scalpel ---");
  const CutFacet = await ethers.getContractFactory("DiamondCutFacet");
  const cutFacet = await CutFacet.deploy();
  await cutFacet.waitForDeployment();
  const cutFacetAddress = await cutFacet.getAddress();
  console.log("DiamondCutFacet deployed at:", cutFacetAddress);

  // Since we can't call diamondCut on the Diamond yet, 
  // we have to assume the Diamond was deployed with the CutFacet logic 
  // OR we need to redeploy the Diamond Stone with the correct constructor.
  
  console.log("\n⚠️ ATTENTION: The Stone at " + diamondAddress + " is unresponsive.");
  console.log("If this is a fresh local node, it is better to REDEPLOY the whole Stone.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
