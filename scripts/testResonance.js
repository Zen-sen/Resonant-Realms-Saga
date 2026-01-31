const { ethers } = require("hardhat");

async function main() {
  const DIAMOND_ADDRESS = "0x8198f5d8F8CfFE8f9C413d98a0A55aEB8ab9FbB7";
  const [player] = await ethers.getSigners();

  const mentorship = await ethers.getContractAt("MentorshipFacet", DIAMOND_ADDRESS);
  const heritage = await ethers.getContractAt("AncestralHeritageFacet", DIAMOND_ADDRESS);

  console.log("🕯️ Testing the Awakening Resonance...");

  // 1. Check current state
  const stats = await heritage.getPlayerStats(player.address);
  console.log("👤 Current Tribe:", stats[0].toString());
  console.log("🧬 Buff Mask:", stats[2].toString());

  // 2. Record a score of 1000
  console.log("🎮 Simulating Match-3 Score: 1000");
  const tx = await mentorship.recordAwakening(1000);
  const receipt = await tx.wait();

  // 3. Verify Points
  const points = await mentorship.getUbuntuPoints(player.address);
  
  console.log("---");
  console.log("✨ Total Ubuntu Points (including initial join bonus):", points.toString());
  
  // Logic check:
  // Initial join resonance = 1
  // Tribe 12 multiplier = 1.1x
  // 1000 * 1.1 = 1100
  // Total should be 1101
  if (points.toString() === "1101") {
    console.log("✅ SUCCESS: Ubuntu Multiplier applied correctly (110%).");
  } else {
    console.log("ℹ️ Points calculated:", points.toString(), "(Check if previous tests added points)");
  }
  console.log("---");
}

main().catch(console.error);
