const { ethers } = require("hardhat");

async function main() {
  const diamondAddress = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e";
  
  console.log("🚀 Forge Active: Deploying GravityFacet...");
  const GravityFacet = await ethers.getContractFactory("GravityFacet");
  const gravityFacet = await GravityFacet.deploy();
  await gravityFacet.waitForDeployment();
  
  const facetAddress = await gravityFacet.getAddress();
  console.log("✅ GravityFacet deployed to:", facetAddress);

  // 1. Get the Diamond contract instance using the IDiamondCut interface
  // This is the "Surgical Tool" for the Diamond Standard
  const diamond = await ethers.getContractAt("IDiamondCut", diamondAddress);

  // 2. Map the function selectors from our new GravityFacet
  const selectors = [
    gravityFacet.interface.getFunction("syncTribePhysics").selector,
    gravityFacet.interface.getFunction("updatePhysicalState").selector,
    gravityFacet.interface.getFunction("getPhysicalState").selector,
    gravityFacet.interface.getFunction("batchUpdatePhysics").selector
  ];

  console.log("💎 Performing Diamond Cut for selectors:", selectors);

  // 3. Prepare the Cut Array
  // Action: 0 (Add), 1 (Replace), 2 (Remove)
  const cut = [{
    facetAddress: facetAddress,
    action: 0, 
    functionSelectors: selectors
  }];

  // 4. Execute the Cut
  // We use ZeroAddress and "0x" because we aren't calling an init function this time
  const tx = await diamond.diamondCut(cut, ethers.ZeroAddress, "0x");
  await tx.wait();

  console.log("✨ Anti-Gravity Logic officially fused with the Diamond Stone!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});