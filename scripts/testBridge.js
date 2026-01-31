const { ethers } = require("hardhat");

async function main() {
  const DIAMOND_ADDRESS = "0x8198f5d8F8CfFE8f9C413d98a0A55aEB8ab9FbB7";
  const [player] = await ethers.getSigners();

  const heritage = await ethers.getContractAt("AncestralHeritageFacet", DIAMOND_ADDRESS);

  console.log("🌉 Testing the Balanced Bridge Synthesis...");

  // 1. Initialize and Join Tribe 12
  console.log("🌍 Initializing Matrix...");
  await (await heritage.initializeTribalMatrix()).wait();

  console.log("🌍 Joining Tribe 12 (Synthesis)...");
  await (await heritage.joinTribe(12)).wait();

  // 2. Select Tribe 0's Buff (Khoe-San)
  console.log("⚔️ Borrowing Khoe-San Primordial Wisdom (Index 0)...");
  // Note: Our logic checks (borrowed > 0 && borrowed < 12)
  // Let's borrow Tribe 1 (First Neighbor) for this test
  await (await heritage.selectSynthesisBuff(1)).wait();

  // 3. Verify the Bitmask
  const stats = await heritage.getPlayerStats(player.address);
  const tribeId = stats[0];
  const buffMask = stats[2];

  console.log("---");
  console.log("👤 Player Tribe:", tribeId.toString());
  console.log("🧬 Bitwise Buff Mask:", buffMask.toString());
  
  // Tribe 12 is (1 << 12) = 4096
  // Tribe 1 is (1 << 1) = 2
  // Total should be 4098
  if (buffMask.toString() === "4098") {
    console.log("✅ SUCCESS: The Bridge is holding! Synthesis (4096) + Tribe 1 (2) = 4098.");
  } else {
    console.log("⚠️ Mask mismatch. Current Value:", buffMask.toString());
  }
  console.log("---");
}

main().catch(console.error);
