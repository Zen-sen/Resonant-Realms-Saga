const { ethers } = require("hardhat");

async function main() {
  const diamondAddress = "0x2b0d36facd61b71cc05ab8f3d2355ec3631c0dd5"; // Your Active Diamond
  const facetAddress = "0xfbc22278a96299d91d41c453234d97b4f5eb9b2d"; // Your New Facet

  const diamondCutFacet = await ethers.getContractAt("IDiamondCut", diamondAddress);

  // Function selector for mintAncestralBunny(uint256,uint256,string,string)
  // You can also get this dynamically from the contract interface
  const selectors = [
    ethers.id("mintAncestralBunny(uint256,uint256,string,string)").substring(0, 10),
    ethers.id("getDualityStatus(uint256)").substring(0, 10)
  ];

  console.log("💎 Bashing the Diamond Cut...");
  console.log(`Linking Selectors: ${selectors} to Facet: ${facetAddress}`);

  const tx = await diamondCutFacet.diamondCut(
    [{
      facetAddress: facetAddress,
      action: 0, // Add = 0, Replace = 1, Remove = 2
      functionSelectors: selectors
    }],
    ethers.ZeroAddress,
    "0x"
  );

  await tx.wait();
  console.log("✅ SUCCESS: The Stone has been taught the Ancestral Pulse.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});