const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("⚒️ Staging the Forge with account:", deployer.address);

  // 1. Deploy the DiamondCutFacet first (The "Cutting Tool")
  const DiamondCutFacet = await ethers.getContractFactory("DiamondCutFacet");
  const cutFacet = await DiamondCutFacet.deploy();
  await cutFacet.waitForDeployment();
  const cutFacetAddress = await cutFacet.getAddress();
  console.log("✂️ DiamondCutFacet manifested at:", cutFacetAddress);

  // 2. Deploy the Diamond Stone (Pass BOTH arguments)
  const Diamond = await ethers.getContractFactory("Diamond");
  // Arguments: (Owner Address, DiamondCutFacet Address)
  const diamond = await Diamond.deploy(deployer.address, cutFacetAddress);
  await diamond.waitForDeployment();
  const diamondAddress = await diamond.getAddress();
  console.log("💎 Diamond Stone manifested at:", diamondAddress);

  // 3. Deploy the Ancestral Heritage Facet (The Game Logic)
  const HeritageFacet = await ethers.getContractFactory("AncestralHeritageFacet");
  const heritageFacet = await HeritageFacet.deploy();
  await heritageFacet.waitForDeployment();
  const heritageAddress = await heritageFacet.getAddress();
  console.log("🏺 Ancestral Heritage Facet manifested at:", heritageAddress);

  // 4. The Ritual of the Cut (Adding the Heritage functions)
  const selectors = ["0x30663456", "0x56a64010"]; // joinTribe, getPlayerStats
  const diamondCut = await ethers.getContractAt("IDiamondCut", diamondAddress);
  
  console.log("⚔️ Performing the Diamond Cut...");
  const tx = await diamondCut.diamondCut(
    [{
      facetAddress: heritageAddress,
      action: 0, // Add
      functionSelectors: selectors
    }],
    ethers.ZeroAddress,
    "0x"
  );
  await tx.wait();

  console.log("✨ SUCCESS: The Trust Node is fully integrated at:", diamondAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});