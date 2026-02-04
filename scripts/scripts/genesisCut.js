const { ethers } = require("hardhat");

async function main() {
  const diamondAddress = "0xf5059a5D33d5853360D16C683c16e67980206f36"; 
  const [deployer] = await ethers.getSigners();

  console.log("\n⚒️ --- Recovering the Diamond Mouth --- ⚒️");

  // 1. First, we must ensure the DiamondCutFacet is deployed and known
  const DiamondCutFacet = await ethers.getContractFactory("DiamondCutFacet");
  const cutFacet = await DiamondCutFacet.deploy();
  await cutFacet.waitForDeployment();
  const cutFacetAddr = await cutFacet.getAddress();
  console.log("✅ DiamondCutFacet (The Mouth) at:", cutFacetAddr);

  // 2. Deploy the Heritage logic (The Wisdom)
  const AncestralHeritageFacet = await ethers.getContractFactory("AncestralHeritageFacet");
  const heritageFacet = await AncestralHeritageFacet.deploy();
  await heritageFacet.waitForDeployment();
  const heritageAddr = await heritageFacet.getAddress();
  console.log("✅ AncestralHeritageFacet (The Wisdom) at:", heritageAddr);

  // 3. Prepare the selectors for BOTH
  const cutSelectors = ["0x1f931c1c"]; // diamondCut((address,uint8,bytes4[])[],address,bytes)
  const heritageSelectors = ["0x4fd66eae", "0x05382080", "0x5ae7f54d", "0x32c171dc", "0xcb15eb48", "0x97446525"];

  const cut = [
    {
      facetAddress: cutFacetAddr,
      action: 0, 
      functionSelectors: cutSelectors
    },
    {
      facetAddress: heritageAddr,
      action: 0, 
      functionSelectors: heritageSelectors
    }
  ];

  // 🧪 VITAL STEP: We call the Diamond directly using the CUT FACET'S ABI 
  // because the Diamond doesn't know it has this function yet!
  const diamondAsCut = await ethers.getContractAt("DiamondCutFacet", diamondAddress, deployer);
  
  console.log("💎 Attempting to graft the Mouth and the Wisdom...");
  
  // If the Diamond was deployed correctly, it should allow the owner to call this
  const tx = await diamondAsCut.diamondCut(cut, ethers.ZeroAddress, "0x");
  await tx.wait();
  
  console.log("✨ Success! The Stone can now speak and remember.");
}

main().catch((error) => {
  console.error("❌ Evolution failed:", error.message);
  process.exitCode = 1;
});