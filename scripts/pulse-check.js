const { ethers } = require("hardhat");

async function main() {
  const diamondAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  // We attach the Factory interface to the Diamond address
  const factory = await ethers.getContractAt("HumanFactoryFacet", diamondAddress);

  console.log("📡 Sending pulse to HumanFactory logic at the Stone...");
  
  try {
    const count = await factory.getHumanCount();
    console.log("✅ Connection established! Human Count:", count.toString());
    console.log("🚀 The Stone is functional. The Loupe just needs a storage alignment.");
  } catch (error) {
    console.log("❌ Pulse failed. The function selectors might not be inscribed correctly.");
    console.error(error.message);
  }
}

main().catch(console.error);
