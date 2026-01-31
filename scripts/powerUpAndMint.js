const { ethers } = require("hardhat");

async function main() {
  const DIAMOND_ADDRESS = "0x8198f5d8F8CfFE8f9C413d98a0A55aEB8ab9FbB7";
  const [player] = await ethers.getSigners();

  const mentorship = await ethers.getContractAt("MentorshipFacet", DIAMOND_ADDRESS);
  const factory = await ethers.getContractAt("BunnyFactoryFacet", DIAMOND_ADDRESS);

  console.log("⚡ Re-Awakening Resonance for the current Stone...");
  
  // 1. Earn the points again (1000 score * 1.1 multiplier = 1100 points)
  const awakeTx = await mentorship.recordAwakening(1000);
  await awakeTx.wait();
  
  const balance = await mentorship.getUbuntuPoints(player.address);
  console.log("💰 Current Ubuntu Balance:", balance.toString());

  // 2. Now attempt the mint
  console.log("🤱 Minting Bunny #1 with Synthesis Influence...");
  const mintTx = await factory.mintNextGeneration(4096);
  await mintTx.wait();

  // 3. Verify
  const bunny1 = await factory.getBunny(1);
  console.log("---");
  console.log("✨ SUCCESS: Bunny #1 is Born!");
  console.log("🧬 Genes:", bunny1.genes.toString());
  console.log("---");
}

main().catch(console.error);
