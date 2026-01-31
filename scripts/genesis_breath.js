const { ethers } = require("hardhat");

async function main() {
  // Living Stone Address - The Diamond Proxy
  const DIAMOND_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  
  const [admin] = await ethers.getSigners();

  console.log("🌬️ Initiating Genesis Breath for Bunny #0...");
  console.log("📍 Target Diamond:", DIAMOND_ADDRESS);

  // Attach to the Diamond using the AncestralHeritageFacet's ABI
  const heritage = await ethers.getContractAt("AncestralHeritageFacet", DIAMOND_ADDRESS);

  try {
    // Tribe 0 = Khoe-San (The First Nations Foundation)
    console.log("🌍 Joining the Khoe-San Tribe (Index 0)...");
    const tx = await heritage.joinTribe(0);
    
    console.log("⏳ Waiting for the breath to stabilize...");
    await tx.wait();

    console.log("🧬 Fetching Player Stats from the Stone...");
    const stats = await heritage.getPlayerStats(admin.address);

    console.log("---");
    console.log("✨ SUCCESS: Bunny #0 (ǃKaggen) is breathing.");
    
    // Access struct/tuple indices: 0 = TribeID, 1 = Resonance
    console.log("👤 Player Tribe ID:", stats[0].toString()); 
    console.log("🏺 Resonance Level:", stats[1].toString());
    console.log("---");
  } catch (error) {
    console.error("❌ Breath Failed:", error.message);
    console.log("💡 Guru Hint: If you get 'Function does not exist', ensure the selectors [0x30663456, 0x56a64010] match your Facet.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});