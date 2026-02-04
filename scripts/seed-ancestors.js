const { ethers } = require("hardhat");

async function main() {
  const diamondAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  const [deployer] = await ethers.getSigners();
  const artifact = await artifacts.readArtifact("HumanFactoryFacet");
  const factory = new ethers.Contract(diamondAddress, artifact.abi, deployer);

  console.log("--- Seeding the Bloodlines: Genetic Awakening ---");

  try {
    console.log("Minting Human #0 (Khoe-San Foundation)...");
    const tx0 = await factory.mintGenesisHuman(0); 
    await tx0.wait();
    console.log("Human #0 Confirmed.");

    console.log("Minting Human #1 (Coloured Tribe Synthesis)...");
    const tx1 = await factory.mintGenesisHuman(12);
    await tx1.wait();
    console.log("Human #1 Confirmed.");

    console.log("The Ancestors are now breathing.");
  } catch (error) {
    console.error("Minting Failed:", error.message);
  }
}

main().catch(console.error);
