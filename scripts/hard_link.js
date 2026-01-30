const { ethers } = require("hardhat");

async function main() {
  const DIAMOND_ADDRESS = "0x9E545E3C0baAB3E08CdfD552C960A1050f373042";
  const HERITAGE_FACET = "0xa82fF9aFd8f496c3d6ac40E2a0F282E47488CFc9";
  
  const [architect] = await ethers.getSigners();
  const diamond = await ethers.getContractAt("Diamond", DIAMOND_ADDRESS);

  console.log("🛠️ Attempting Hard Link of Ancestral Heritage...");

  // joinTribe(uint256) -> 0x30663456
  // getPlayerStats(address) -> 0x56a64010
  const selectors = ["0x30663456", "0x56a64010"];

  try {
    const tx = await diamond.setFacetsBatch(selectors, HERITAGE_FACET);
    console.log("⏳ Sending transaction...");
    await tx.wait();
    console.log("✅ Architect has set the batch. Testing link...");

    // Immediate test: Does the Diamond recognize the function now?
    const heritage = await ethers.getContractAt("AncestralHeritageFacet", DIAMOND_ADDRESS);
    const stats = await heritage.getPlayerStats(architect.address);
    console.log("✨ Link Verified! Stats retrieved:", stats.toString());
    
  } catch (error) {
    console.error("❌ Link Failed:", error.message);
    console.log("\n💡 Guru Analysis: If this succeeded but the next call fails,");
    console.log("the storage slot in Diamond.sol is NOT the same as HeritageFacet.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});