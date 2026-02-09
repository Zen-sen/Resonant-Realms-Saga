const hre = require("hardhat");

async function main() {
  // Replace with your local Diamond address from your records
  const diamondAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
  
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
