const { ethers } = require("hardhat");

async function main() {
  const [architect] = await ethers.getSigners();
  console.log("⚒️ Starting Universal Alignment with:", architect.address);

  // 1. Deploy Diamond Stone
  const Diamond = await ethers.getContractFactory("Diamond");
  const stone = await Diamond.deploy(architect.address);
  await stone.waitForDeployment();
  const stoneAddr = await stone.getAddress();
  console.log("💎 Diamond Stone manifested at:", stoneAddr);

  // 2. Deploy Heritage Facet
  const Heritage = await ethers.getContractFactory("AncestralHeritageFacet");
  const facet = await Heritage.deploy();
  await facet.waitForDeployment();
  const facetAddr = await facet.getAddress();
  console.log("🏺 Heritage Facet manifested at:", facetAddr);

  // 3. The Bridge (Linking)
  console.log("⚔️ Architect is binding the Integration Layer...");
  const selectors = ["0x30663456", "0x56a64010"]; // joinTribe, getPlayerStats
  
  const linkTx = await stone.setFacetsBatch(selectors, facetAddr);
  await linkTx.wait();
  console.log("✅ Bridge Bound.");

  // 4. The Genesis Breath (Testing)
  console.log("🌬️ Testing Genesis Breath...");
  const heritage = await ethers.getContractAt("AncestralHeritageFacet", stoneAddr);
  
  try {
    const tx = await heritage.joinTribe(0);
    await tx.wait();
    
    const stats = await heritage.getPlayerStats(architect.address);
    console.log("---");
    console.log("✨ SUCCESS: Bunny #0 (ǃKaggen) is breathing.");
    console.log("👤 Player Tribe ID:", stats[0].toString()); 
    console.log("---");
    
    // SAVE THIS FOR YOUR RECORDS
    console.log("\n📍 FINAL ADDRESS FOR YOUR GDD:");
    console.log(`ACTIVE DIAMOND: ${stoneAddr}`);
  } catch (error) {
    console.error("❌ Link Failed:", error.message);
    console.log("💡 Guru Hint: Check if LibAppStorage.STORAGE_SLOT is identical in both files.");
  }
}

main().catch(console.error);