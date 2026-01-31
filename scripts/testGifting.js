const { ethers } = require("hardhat");

async function main() {
  const DIAMOND_ADDRESS = "0x8198f5d8F8CfFE8f9C413d98a0A55aEB8ab9FbB7";
  const [architect, newcomer] = await ethers.getSigners();

  const gifting = await ethers.getContractAt("UbuntuGiftingFacet", DIAMOND_ADDRESS);
  const mentorship = await ethers.getContractAt("MentorshipFacet", DIAMOND_ADDRESS);
  const heritage = await ethers.getContractAt("AncestralHeritageFacet", DIAMOND_ADDRESS);

  console.log("🤝 Initiating the Ritual of Ubuntu Gifting...");

  // 1. Ensure the newcomer has a tribe (Khoe-San Index 0)
  console.log("👤 Newcomer joining the Khoe-San Tribe...");
  await heritage.connect(newcomer).joinTribe(0);

  // 2. Check Architect Balance (Should be around 201 after minting Bunny #1)
  const archBalanceBefore = await mentorship.getUbuntuPoints(architect.address);
  console.log("💰 Architect Balance:", archBalanceBefore.toString());

  // 3. Gift 100 Points
  console.log("🎁 Gifting 100 Ubuntu Points to the newcomer...");
  const tx = await gifting.giftResonance(newcomer.address, 100);
  await tx.wait();

  // 4. Verify Results
  const newcomerBalance = await mentorship.getUbuntuPoints(newcomer.address);
  const genRank = await gifting.getGenerosityRank(architect.address);

  console.log("---");
  console.log("✨ Newcomer Received (incl. 5% Bridge Bonus):", newcomerBalance.toString());
  console.log("🎖️ Architect Generosity Rank:", genRank.toString());
  console.log("---");
  console.log("✅ Collective Resonance established.");
}

main().catch(console.error);
