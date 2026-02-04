const { ethers } = require("hardhat");

/**
 * GENESIS BREATHING TEST: Diamond Pulse & Loupe Verification
 * Realm: node.js
 * Project: Resonant Realms Saga
 */
async function main() {
  const address = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e";
  console.log("\n--- 🧘 Checking the Pulse of the Diamond ---");
  console.log("Target Address:", address);
  
  // 1. Physical Presence Check
  const code = await ethers.provider.getCode(address);
  
  if (code === "0x") {
    console.log("❌ Result: No contract found. This address is empty.");
    return;
  } 

  console.log("✅ Result: Contract found! Bytecode length:", code.length);

  // 2. Logical Connection Check (The Loupe)
  try {
    // We attach the IDiamondLoupe interface to our proxy address
    const loupe = await ethers.getContractAt("IDiamondLoupe", address);
    const facets = await loupe.facets();
    
    console.log(`💎 Diamond Active: ${facets.length} Facets linked.`);
    
    // Detailed facet breakdown for transparency
    facets.forEach((facet, index) => {
      console.log(`   [${index}] Facet: ${facet.facetAddress} (${facet.functionSelectors.length} selectors)`);
    });

  } catch (e) {
    console.log("⚠️  Warning: Contract exists but IDiamondLoupe is missing or not linked.");
    console.log("💡 Tip: Ensure DiamondLoupeFacet was included in your 'setFacetsBatch' or 'diamondCut'.");
  }
  
  console.log("-------------------------------------------\n");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});