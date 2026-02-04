const { ethers } = require("hardhat");

async function main() {
  const DIAMOND_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const [admin] = await ethers.getSigners();

  console.log("\n🌬️ --- Initiating Genesis Breath for Human #0 (ǃKaggen) --- 🌬️");

  const heritage = await ethers.getContractAt("AncestralHeritageFacet", DIAMOND_ADDRESS);
  const factory = await ethers.getContractAt("HumanFactoryFacet", DIAMOND_ADDRESS);

  try {
    // 1. Initialize the Matrix (Establish the 13 Tribes)
    console.log("🌍 Initializing Tribal Matrix...");
    const initTx = await heritage.initializeTribalMatrix();
    await initTx.wait();
    console.log("   ✓ Matrix resonating");

    // 2. Join the Foundation (Khoe-San Tribe - Index 0)
    console.log("🌍 Aligning Player with the Khoe-San Tribe...");
    const tribeTx = await heritage.joinTribe(0);
    await tribeTx.wait();

    // 3. The Birth of ǃKaggen
    console.log("🏺 Forging Genesis Human #0...");
    const mintTx = await factory.mintGenesisHuman(0); // Minting via Tribe 0
    await mintTx.wait();

    // 4. Verification
    const count = await factory.getHumanCount();
    const bunny = await factory.getHuman(0);

    console.log("\n--- Manifestation Report ---");
    console.log("✨ SUCCESS: ǃKaggen is locked into the Hashed Storage.");
    console.log("🐰 Total Bunnies in Realm:", count.toString());
    console.log("🧬 Human #0 DNA/Genes:", bunny.genes?.toString() || bunny.dna?.toString());
    console.log("----------------------------\n");

  } catch (error) {
    console.error("❌ Ritual Interrupted:");
    console.error(error.message);
  }
}

main().catch(console.error);