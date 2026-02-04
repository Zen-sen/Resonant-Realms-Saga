const { ethers } = require("hardhat");

async function main() {
  // Anchoring to the New Sovereign Stone
  const diamondAddress = "0xf5059a5D33d5853360D16C683c16e67980206f36"; 
  const [deployer] = await ethers.getSigners();

  console.log("\n⚒️ --- Starting Genesis Cut: Resonant Realms --- ⚒️");
  console.log("Using Diamond at:", diamondAddress);

  // 1. Deploy AncestralHeritageFacet
  const AncestralHeritageFacet = await ethers.getContractFactory("AncestralHeritageFacet");
  const heritageFacet = await AncestralHeritageFacet.deploy();
  await heritageFacet.waitForDeployment();
  const heritageAddr = await heritageFacet.getAddress();
  console.log("✅ AncestralHeritageFacet deployed to:", heritageAddr);

  // 2. Prepare the Diamond Cut
  const heritageSelectors = [
    "0x4fd66eae", "0x05382080", "0x5ae7f54d", "0x32c171dc", "0xcb15eb48", "0x97446525"
  ];

  const cut = [{
    facetAddress: heritageAddr,
    action: 0, 
    functionSelectors: heritageSelectors
  }];

  // 3. Execute the Cut
  const diamondCutFacet = await ethers.getContractAt("IDiamondCut", diamondAddress, deployer);
  console.log("💎 Cutting logic into Diamond Stone...");
  const tx = await diamondCutFacet.diamondCut(cut, ethers.ZeroAddress, "0x");
  await tx.wait();
  console.log("✨ Diamond Cut Complete.");

  // 4. Initialize Tribal Matrix
  const heritage = await ethers.getContractAt("AncestralHeritageFacet", diamondAddress, deployer);
  console.log("🌍 Activating the Foundation (Khoe-San)...");
  const initTx = await heritage.initializeTribalMatrix();
  await initTx.wait();
  console.log("🕊️ Matrix Initialized: Integration Layer (Index 12) is live.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
