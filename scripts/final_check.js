const { ethers } = require("hardhat");

async function main() {
  const DIAMOND_ADDR = "0xcbEAF3BDe82155F56486Fb5a1072cb8baAf547cc";
  const stone = await ethers.getContractAt("Diamond", DIAMOND_ADDR);

  // These are the selectors we THINK we registered
  const joinTribeSelector = "0x30663456";
  const getStatsSelector = "0x56a64010";

  console.log("🧐 Probing the Stone's Memory...");
  
  const facetForJoin = await stone.selectorToFacet(joinTribeSelector);
  const facetForStats = await stone.selectorToFacet(getStatsSelector);

  console.log(`📍 Selector ${joinTribeSelector} points to: ${facetForJoin}`);
  console.log(`📍 Selector ${getStatsSelector} points to: ${facetForStats}`);

  if (facetForJoin === ethers.ZeroAddress) {
    console.log("❌ CRITICAL: The Diamond map is EMPTY. The binding failed!");
  } else {
    console.log("✅ The Diamond HAS the address. The failure is in the DELEGATECALL.");
  }
}

main().catch(console.error);