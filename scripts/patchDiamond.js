const { ethers } = require("hardhat");

async function main() {
  const DIAMOND_ADDRESS = "0x5f3f1dBD7B74C6B46e8c44f98792A1dAf8d69154";
  const heritageAddress = "0x4c5859f0F772848b2D91F1D83E2Fe57935348029"; 

  console.log("🩹 Manual Patching the Stone...");

  const stone = await ethers.getContractAt("Diamond", DIAMOND_ADDRESS);

  // We manually define the selector for 'getTribeCount()'
  // ID = bytes4(keccak256("getTribeCount()"))
  const selector = ethers.id("getTribeCount()").substring(0, 10);

  console.log("Adding selector:", selector);

  const tx = await stone.setFacetsBatch(heritageAddress, [selector]);
  await tx.wait();

  console.log("✨ SUCCESS: The Stone's memory is updated.");
}

main().catch(console.error);
