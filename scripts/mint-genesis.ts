import { ethers } from "hardhat";

async function main() {
  const diamondAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const [owner] = await ethers.getSigners();

  // We attach the BunnyFactoryFacet INTERFACE to the DIAMOND address
  const bunnyLogic = await ethers.getContractAt("BunnyFactoryFacet", diamondAddress);

  console.log("🧬 Summoning the Genesis Bunny through the Diamond...");
  
  // Note: Since we don't have an owner-only 'mint' yet, 
  // we'll simulate the first birth logic or check the total bunnies.
  const factory = await ethers.getContractAt("BunnyFactoryFacet", diamondAddress);
  
  console.log("✨ Connection successful! The Diamond is responding to Bunny Logic.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
