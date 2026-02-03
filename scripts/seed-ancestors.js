const { ethers } = require("hardhat");

async function main() {
  const diamondAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  const [deployer] = await ethers.getSigners();
  const artifact = await artifacts.readArtifact("BunnyFactoryFacet");
  const factory = new ethers.Contract(diamondAddress, artifact.abi, deployer);

  console.log("--- Seeding the Bloodlines: Genetic Awakening ---");

  try {
    console.log("Minting Bunny #0 (Khoe-San Foundation)...");
    const tx0 = await factory.mintGenesisBunny(0); 
    await tx0.wait();
    console.log("Bunny #0 Confirmed.");

    console.log("Minting Bunny #1 (Coloured Tribe Synthesis)...");
    const tx1 = await factory.mintGenesisBunny(12);
    await tx1.wait();
    console.log("Bunny #1 Confirmed.");

    console.log("The Ancestors are now breathing.");
  } catch (error) {
    console.error("Minting Failed:", error.message);
  }
}

main().catch(console.error);
