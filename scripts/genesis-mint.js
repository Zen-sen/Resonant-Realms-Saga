const hre = require("hardhat");

async function main() {
  // Replace with your local Diamond address from your records
  const diamondAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  
  // We attach to the BunnyFactoryFacet (or BreedingFacet) logic via the Diamond Proxy
  const bunnyFactory = await hre.ethers.getContractAt("BreedingFacet", diamondAddress);
  
  console.log("--- INITIATING GENESIS BREATHING TEST ---");
  console.log("Minting Bunny #0: ǃKaggen (Foundation)...");

  // In a real scenario, we'd have a specific 'mintGenesis' function. 
  // For now, we manually initialize the Tribal Matrix first.
  const heritage = await hre.ethers.getContractAt("AncestralHeritageFacet", diamondAddress);
  
  const initTx = await heritage.initializeTribalMatrix();
  await initTx.wait();
  console.log("Tribal Matrix Initialized: Khoe-San (0) and Synthesis (12) are LIVE.");

  // Join the tribe to allow minting
  const joinTx = await heritage.joinTribe(0);
  await joinTx.wait();
  console.log("Architect has joined the Khoe-San Tribe.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
