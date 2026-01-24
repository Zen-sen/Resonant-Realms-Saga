const { ethers } = require("hardhat");

async function main() {
  // 1. Point to your existing Diamond address (from previous output)
  const diamondAddress = "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0";
  const [deployer] = await ethers.getSigners();

  console.log("Adding Ancestral Heritage to Diamond at:", diamondAddress);

  // 2. Deploy the AncestralHeritageFacet
  const AncestralHeritageFacet = await ethers.getContractFactory("AncestralHeritageFacet");
  const heritageFacet = await AncestralHeritageFacet.deploy();
  await heritageFacet.waitForDeployment();
  const facetAddress = await heritageFacet.getAddress();
  console.log("Heritage Facet deployed to:", facetAddress);

  // 3. Prepare the selectors (The specific functions we are adding)
  // We manually list the function signatures we want the Diamond to recognize
  const selectors = [
    "chooseTribe(uint256)",
    "earnPoints(uint256)",
    "getPlayerStats(address)"
  ].map(sig => ethers.id(sig).substring(0, 10));

  // 4. Perform the Cut
  const diamondCut = await ethers.getContractAt("IDiamondCut", diamondAddress);
  
  const cut = [{
    facetAddress: facetAddress,
    action: 0, // 0 is 'Add'
    functionSelectors: selectors
  }];

  const tx = await diamondCut.diamondCut(cut, ethers.ZeroAddress, "0x");
  await tx.wait();

  console.log("--- Second Cut Complete ---");
  console.log("The Stone now contains the Ancestral Heritage logic.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
