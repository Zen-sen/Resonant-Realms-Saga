const { ethers } = require("hardhat");

async function main() {
  const diamondAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  const [deployer] = await ethers.getSigners();
  const artifact = await artifacts.readArtifact("HumanFactoryFacet");
  const factory = new ethers.Contract(diamondAddress, artifact.abi, deployer);

  console.log("--- Genetic Audit: Decoding the Bloodlines ---");

  for (let i = 0; i < 2; i++) {
    const bunny = await factory.getHuman(i);
    const genes = bunny.genes;
    
    // Decoding bits locally to verify AncestralUtils logic
    const tribeId = Number(genes & 0xFFFFn);
    const resonance = Number((genes >> 16n) & 0xFFFFn);
    
    console.log(`Human #${i}:`);
    console.log(`  - Raw Genes: ${genes.toString()}`);
    console.log(`  - Tribe ID:  ${tribeId}`);
    console.log(`  - Resonance: ${resonance}`);
    console.log("-----------------------");
  }
}

main().catch(console.error);
