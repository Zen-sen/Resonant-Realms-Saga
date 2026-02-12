const { ethers } = require("hardhat");

async function main() {
  const diamondAddress = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e";
  
  // Connect to the Diamond using the GravityFacet interface
  const gravity = await ethers.getContractAt("GravityFacet", diamondAddress);

  console.log("Ì≥° Querying Diamond Stone at:", diamondAddress);

  try {
    console.log("Ì∑¨ Syncing Khoe-San (Tribe 0) Physical Constants...");
    const tx = await gravity.syncTribePhysics(0);
    await tx.wait();
    console.log("‚úÖ Transaction Confirmed. GravityFacet is LIVE and Functional.");
  } catch (error) {
    console.error("‚ùå Linkage Error:", error.message);
  }
}

main().catch(console.error);
