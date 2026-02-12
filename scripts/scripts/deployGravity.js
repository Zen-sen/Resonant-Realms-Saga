const { ethers } = require("hardhat");

async function main() {
  const diamondAddress = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e";
  
  console.log("🚀 Starting the Forge: Linking GravityFacet...");

  const GravityFacet = await ethers.getContractFactory("GravityFacet");
  const gravityFacet = await GravityFacet.deploy();
  await gravityFacet.waitForDeployment();

  console.log("✅ GravityFacet deployed to:", await gravityFacet.getAddress());

  // Logic for the Diamond Cut would go here to link the selectors
  // For now, let's ensure the contract is compiled and deployed.
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});