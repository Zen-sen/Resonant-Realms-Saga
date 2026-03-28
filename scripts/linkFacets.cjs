const hre = require("hardhat");

async function main() {
  const diamondAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("═══════════════════════════════════════════════════════════");
  console.log("   LINKING FACETS TO DIAMOND");
  console.log("═══════════════════════════════════════════════════════════");
  
  const diamond = await hre.ethers.getContractAt("Diamond", diamondAddress);
  
  const facetNameToSelectors = {
    "BunnyFactoryFacet": [
      "0x登场"
    ],
  };
  
  const facetMappings = [
    { name: "BunnyFactoryFacet", address: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0", selectors: ["0x0d3695fe"] },
    { name: "HumanFactoryFacet", address: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9", selectors: ["0x0d3695fe"] },
    { name: "BreedingFacet", address: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9", selectors: ["0x0d3695fe"] },
    { name: "GravityFacet", address: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707", selectors: ["0x0d3695fe"] },
    { name: "AntigravityFacet", address: "0x0165878A594ca255338adfa4d48449f69242Eb8F", selectors: ["0x0d3695fe"] },
    { name: "ResonanceFacet", address: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853", selectors: ["0x0d3695fe"] },
  ];
  
  for (const mapping of facetMappings) {
    try {
      const tx = await diamond.connect(deployer).setFacetsBatch(
        mapping.address,
        mapping.selectors
      );
      await tx.wait();
      console.log(`✅ ${mapping.name} linked successfully`);
    } catch (error) {
      console.log(`⚠️  ${mapping.name}: ${error.message?.slice(0, 60) || "Error"}`);
    }
  }
  
  console.log("\n✨ Facet linking complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
