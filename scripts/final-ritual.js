const { ethers } = require("hardhat");

async function main() {
  const diamondAddress = "0x95401dc811bb5740090279Ba06cfA8fcF6113778";
  const [deployer] = await ethers.getSigners();
  const factory = await ethers.getContractAt("BunnyFactoryFacet", diamondAddress);

  console.log("--- 🕯️ Seeding the Key Bloodlines ---");
  // We mint a few to test the registry
  const tx0 = await factory.mintGenesisBunny(0); // Khoe-San
  await tx0.wait();
  console.log("Khoe-San Awakened.");

  const tx1 = await factory.mintGenesisBunny(12); // Bridge
  await tx1.wait();
  console.log("The Bridge Awakened.");

  console.log("\n--- 💎 Reading Tribal Wisdom ---");
  
  // Checking if the Diamond knows these functions
  const count = await factory.getBunnyCount();
  console.log(`Total Ancestors: ${count}`);
  
  for(let i = 0; i < count; i++) {
      const power = await factory.getBunnyPower(i);
      const bunny = await factory.getBunny(i);
      const tribeId = Number(bunny.genes & 0xFFFFn);
      console.log(`Bunny #${i} [Tribe ${tribeId}]: ${power}`);
  }
}

main().catch(console.error);
