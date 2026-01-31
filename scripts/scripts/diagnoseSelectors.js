const { ethers } = require("hardhat");

async function main() {
  const diamondAddress = process.env.DIAMOND_ADDRESS;
  if (!diamondAddress) {
    console.error("❌ Error: DIAMOND_ADDRESS environment variable not set.");
    process.exit(1);
  }

  console.log(`🔍 Diagnosing Diamond at: ${diamondAddress}`);

  // We use the Loupe interface (EIP-2535) to see what functions are registered
  // If the Loupe facet isn't deployed, we'll try to reach the Stone directly
  try {
    const loupe = await ethers.getContractAt("IDiamondLoupe", diamondAddress);
    const facets = await loupe.facets();

    console.log("\n--- Registered Facets and Selectors ---");
    for (const facet of facets) {
      console.log(`\nFacet: ${facet.facetAddress}`);
      facet.functionSelectors.forEach(sig => {
        console.log(`  [Selector]: ${sig}`);
      });
    }
  } catch (error) {
    console.error("\n❌ Error: Could not call Loupe functions.");
    console.log("This usually means the LoupeFacet hasn't been added to the Diamond yet.");
    console.log("The Stone is deaf to its own mirrors.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
