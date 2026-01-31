const { ethers } = require("hardhat");

async function main() {
  const DIAMOND_ADDRESS = "0x8198f5d8F8CfFE8f9C413d98a0A55aEB8ab9FbB7";
  
  console.log("🏺 Re-Inscribing Ubuntu Gifting Facet with full vision...");
  const Gifting = await ethers.getContractFactory("UbuntuGiftingFacet");
  const gifting = await Gifting.deploy();
  await gifting.waitForDeployment();
  const giftingAddress = await gifting.getAddress();
  
  const stone = await ethers.getContractAt("Diamond", DIAMOND_ADDRESS);
  
  // Now we include ALL THREE functions
  const selectors = [
    Gifting.interface.getFunction("giftResonance").selector,
    Gifting.interface.getFunction("getGenerosityRank").selector,
    Gifting.interface.getFunction("getTribeResonance").selector
  ];

  await stone.setFacetsBatch(giftingAddress, selectors);
  console.log("✨ SUCCESS: The Stone now sees the Tribal Pools at:", giftingAddress);
}

main().catch(console.error);
