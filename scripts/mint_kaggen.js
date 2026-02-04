const { ethers } = require("hardhat");

async function main() {
  const DIAMOND_ADDRESS = "0x809d550fca64d94Bd9F66E60752A544199cfAC3D";
  const [admin] = await ethers.getSigners();

  console.log("🌬️ Initiating Genesis Breath at Stone:", DIAMOND_ADDRESS);

  // We connect to the Diamond using the Heritage ABI
  const heritage = await ethers.getContractAt("AncestralHeritageFacet", DIAMOND_ADDRESS);

  try {
    console.log("🌍 Joining the Khoe-San Tribe (Index 0)...");
    // This is the moment of truth for the Integration Layer
    const tx = await heritage.joinTribe(0);
    console.log("⏳ Waiting for the ancestors to confirm...");
    await tx.wait();

    console.log("🧬 Extraction of Divine Data...");
    const stats = await heritage.getPlayerStats(admin.address);

    console.log("---");
    console.log("✨ SUCCESS: Human #0 (ǃKaggen) is breathing.");
    console.log("👤 Player Tribe ID:", stats[0].toString()); 
    console.log("🏺 Ubuntu Points:", stats[1].toString());
    console.log("---");
  } catch (error) {
    console.error("❌ The Stone is still resisting:", error.message);
  }
}

main().catch(console.error);