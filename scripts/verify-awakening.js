const { ethers } = require("hardhat");

async function main() {
  const diamondAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  const [deployer] = await ethers.getSigners();
  const artifact = await artifacts.readArtifact("HumanFactoryFacet");
  const factory = new ethers.Contract(diamondAddress, artifact.abi, deployer);

  console.log("--- 🔎 Verifying Genetic Integrity: The Council of 13 ---");

  // Since we know we minted 0-12 plus previous ones, let's check the first 15 slots
  for (let i = 0; i < 15; i++) {
    try {
      const bunny = await factory.getHuman(i);
      const genes = bunny.genes;
      const tribeId = Number(genes & 0xFFFFn);
      const resonance = Number((genes >> 16n) & 0xFFFFn);
      
      console.log(`Slot #${i} | Tribe: ${tribeId.toString().padStart(2)} | Resonance: ${resonance}`);
    } catch (e) {
      console.log(`Slot #${i}: Empty or End of Registry`);
      break;
    }
  }
}

main().catch(console.error);
