const { ethers } = require("hardhat");

async function main() {
  const DIAMOND_ADDRESS = "0x5081a39b8A5f0E35a8D959395a630b68B74Dd30f";
  const [admin] = await ethers.getSigners();

  const heritage = await ethers.getContractAt("AncestralHeritageFacet", DIAMOND_ADDRESS);
  const factory = await ethers.getContractAt("BunnyFactoryFacet", DIAMOND_ADDRESS);

  console.log("🧐 Probing the Diamond Storage...");

  // Verify Tribe count and existence
  const tribeCount = await heritage.getTribeCount();
  const playerStats = await heritage.getPlayerStats(admin.address);
  
  // Verify Bunny #0 Data
  const bunny0 = await factory.getBunny(0);

  console.log("--- 💎 DIAMOND STATE VERIFICATION ---");
  console.log("📍 Stone Address: ", DIAMOND_ADDRESS);
  console.log("📊 Total Tribes Manifested: ", tribeCount.toString());
  console.log("👤 Admin Alignment: Tribe Index", playerStats[0].toString());
  console.log("✨ Resonance Score: ", playerStats[1].toString());
  console.log("--- 🐰 BUNNY #0 (ǃKAGGEN) ---");
  console.log("🧬 Genes: ", bunny0.genes.toString());
  console.log("⏳ Generation: ", bunny0.generation.toString());
  console.log("🤱 Matron ID: ", bunny0.matronId.toString());
  console.log("👨‍🍼 Sire ID: ", bunny0.sireId.toString());
  console.log("---");

  if (bunny0.genes.toString() === "0" && playerStats[0].toString() === "0") {
    console.log("✅ VERIFIED: The Khoe-San Foundation is solid.");
  } else {
    console.log("⚠️ WARNING: Storage mismatch detected.");
  }
}

main().catch(console.error);
