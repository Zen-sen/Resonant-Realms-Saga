const { ethers } = require("hardhat");

async function main() {
  const DIAMOND_ADDR = "0x04C89607413713Ec9775E14b954286519d836FEf";
  const FACET_ADDR = "0x4C4a2f8c81640e47606d3fd77B353E87Ba015584";
  
  const [admin] = await ethers.getSigners();
  const diamond = await ethers.getContractAt("Diamond", DIAMOND_ADDR);

  console.log("🧐 X-Raying Selector: 0x30663456 (joinTribe)");
  
  // Directly call the mapping on the Diamond Stone
  try {
    const registeredFacet = await diamond.selectorToFacet("0x30663456");
    console.log("📍 Result in Diamond Map:", registeredFacet);
    
    if (registeredFacet.toLowerCase() === FACET_ADDR.toLowerCase()) {
      console.log("✅ THE MAP IS CORRECT. The issue is the Fallback's delegatecall.");
    } else {
      console.log("❌ THE MAP IS EMPTY. The setFacetsBatch didn't save correctly.");
    }
  } catch (e) {
    console.log("💥 Error: The Diamond doesn't even have selectorToFacet as a public mapping!");
  }
}

main().catch(console.error);