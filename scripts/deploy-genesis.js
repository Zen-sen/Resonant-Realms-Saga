const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("--- Genesis Initiation: The Architect's Inscription ---");

  // 1. Deploy the Diamond Stone (The Proxy)
  const Diamond = await ethers.getContractFactory("Diamond");
  const diamond = await Diamond.deploy(deployer.address);
  await diamond.waitForDeployment();
  const diamondAddr = await diamond.getAddress();
  console.log("1. DIAMOND STONE LIVE AT:", diamondAddr);

  // 2. Deploy Facets
  const FacetNames = ["DiamondLoupeFacet", "BunnyFactoryFacet"];
  
  for (const name of FacetNames) {
    const Facet = await ethers.getContractFactory(name);
    const facet = await Facet.deploy();
    await facet.waitForDeployment();
    const facetAddr = await facet.getAddress();
    console.log(`2. Deployed ${name} at: ${facetAddr}`);

    // Get function selectors
    const selectors = [];
    Facet.interface.forEachFunction((fragment) => {
      selectors.push(fragment.selector);
    });

    // 3. Use the Architect's method: setFacetsBatch
    console.log(`   Inscribing ${name} selectors into the Stone...`);
    const tx = await diamond.setFacetsBatch(facetAddr, selectors);
    await tx.wait();
  }

  console.log("--- Genesis Complete: The Resonant Stone is Active ---");
  console.log("FINAL DIAMOND ADDRESS:", diamondAddr);
}

main().catch((error) => {
  console.error("GENESIS FAILED:", error);
  process.exitCode = 1;
});
