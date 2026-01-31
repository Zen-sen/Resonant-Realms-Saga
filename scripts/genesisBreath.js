const { ethers } = require("hardhat");

async function main() {
  const DIAMOND_ADDRESS = "0x5081a39b8A5f0E35a8D959395a630b68B74Dd30f";
  const [admin] = await ethers.getSigners();

  console.log("🌬️ Initiating Genesis Breath for Bunny #0...");
  console.log("📍 Target Diamond:", DIAMOND_ADDRESS);

  const heritage = await ethers.getContractAt("AncestralHeritageFacet", DIAMOND_ADDRESS);
  const factory = await ethers.getContractAt("BunnyFactoryFacet", DIAMOND_ADDRESS);

  try {
    console.log("🌍 Initializing Tribal Matrix...");
    const initTx = await heritage.initializeTribalMatrix();
    await initTx.wait();
    console.log("   ✓ Matrix resonating");

    console.log("🌍 Joining the Khoe-San Tribe (Index 0)...");
    const tribeTx = await heritage.joinTribe(0);
    await tribeTx.wait();

    console.log("🏺 Forging Genesis Bunny #0 (ǃKaggen)...");
    // Gene 0: The Primordial Frequency
    const mintTx = await factory.mintGenesisBunny(0); 
    await mintTx.wait();

    const stats = await heritage.getPlayerStats(admin.address);
    const bunny = await factory.getBunny(0);

    console.log("---");
    console.log("✨ SUCCESS: ǃKaggen is locked into the Hashed Storage.");
    console.log("👤 Player Tribe Alignment:", stats[0].toString());
    console.log("🧬 Bunny #0 Genes:", bunny.genes.toString());
    console.log("🎂 Birth Time:", new Date(Number(bunny.birthTime) * 1000).toLocaleString());
    console.log("---");
  } catch (error) {
    console.error("❌ Ritual Interrupted:", error.message);
  }
}

main().catch(console.error);
