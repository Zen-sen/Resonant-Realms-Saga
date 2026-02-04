const { ethers } = require("hardhat");

async function main() {
  const diamondAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const factory = await ethers.getContractAt("HumanFactoryFacet", diamondAddress);

  console.log("🌬️ Checking the manifestation of Human #0 (ǃKaggen)...");

  try {
    const count = await factory.getHumanCount();
    console.log("Total Bunnies in Realm:", count.toString());

    if (count > 0n) {
      const bunny = await factory.getHuman(0);
      console.log("--- Raw Human Data ---");
      console.log(bunny); 
      console.log("----------------------");
      
      // Attempting to parse based on common Ethers return patterns
      const id = bunny.id || bunny[0];
      const tribe = bunny.tribe || bunny[1];
      
      console.log("Parsed ID:", id?.toString());
      console.log("Parsed Tribe:", tribe?.toString());
    }
  } catch (error) {
    console.error("❌ Error reading the Stone:");
    console.error(error);
  }
}

main().catch(console.error);
