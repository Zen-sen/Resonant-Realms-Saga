const { ethers } = require("hardhat");

async function main() {
  const diamondAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  const [deployer] = await ethers.getSigners();
  const artifact = await artifacts.readArtifact("BunnyFactoryFacet");
  const factory = new ethers.Contract(diamondAddress, artifact.abi, deployer);

  console.log("--- 🌋 Initiating Tribal Stress Test: The Great Awakening ---");

  // We are minting Tribes 0 through 12
  for (let i = 0; i <= 12; i++) {
    try {
      process.stdout.write(`Awakening Tribe #${i}... `);
      const tx = await factory.mintGenesisBunny(i);
      await tx.wait();
      console.log("✅");
    } catch (error) {
      console.log(`❌ Failed at Tribe ${i}: `, error.message);
    }
  }

  console.log("\n--- 🔎 Verifying Genetic Integrity ---");
  const totalBunnies = await factory.getBunnyCount(); // Assumes you have this getter
  console.log(`Total Ancestors in Stone: ${totalBunnies}`);

  for (let i = 0; i < totalBunnies; i++) {
    const bunny = await factory.getBunny(i);
    const tribeId = Number(bunny.genes & 0xFFFFn);
    const resonance = Number((bunny.genes >> 16n) & 0xFFFFn);
    console.log(`Bunny #${i} | Tribe: ${tribeId.toString().padStart(2)} | Resonance: ${resonance}`);
  }
}

main().catch(console.error);
