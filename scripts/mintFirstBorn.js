const { ethers } = require("hardhat");

async function main() {
  const DIAMOND_ADDRESS = "0x8198f5d8F8CfFE8f9C413d98a0A55aEB8ab9FbB7";
  const [player] = await ethers.getSigners();

  const factory = await ethers.getContractAt("BunnyFactoryFacet", DIAMOND_ADDRESS);
  const mentorship = await ethers.getContractAt("MentorshipFacet", DIAMOND_ADDRESS);

  console.log("🧬 Initiating Genetic Manifestation for Bunny #1...");

  // 1. Check Points before minting
  const pointsBefore = await mentorship.getUbuntuPoints(player.address);
  console.log("💰 Ubuntu Points before mint:", pointsBefore.toString());

  // 2. Mint with Synthesis Influence (Bit 12 = 4096)
  console.log("🤱 Minting with Synthesis Influence (Trait 4096)...");
  const tx = await factory.mintNextGeneration(4096);
  await tx.wait();

  // 3. Verify the new Bunny
  const bunny1 = await factory.getBunny(1);
  const pointsAfter = await mentorship.getUbuntuPoints(player.address);

  console.log("---");
  console.log("🐰 BUNNY #1 DATA:");
  console.log("🧬 Genes:", bunny1.genes.toString());
  console.log("⏳ Generation:", bunny1.generation.toString());
  console.log("💰 Ubuntu Points after cost:", pointsAfter.toString());
  
  // Verify the trait exists in the genes
  const hasTrait = (BigInt(bunny1.genes) & BigInt(4096)) !== BigInt(0);
  console.log("✨ Synthesis Trait Manifested:", hasTrait ? "YES" : "NO");
  console.log("---");
}

main().catch(console.error);
