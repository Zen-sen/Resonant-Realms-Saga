const { ethers } = require("hardhat");

async function main() {
  const diamondAddress = "0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44";
  const facetAddress = "0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1";
  const [owner] = await ethers.getSigners();

  // Use the FULLY QUALIFIED NAME to resolve the ambiguity
  const diamondCut = await ethers.getContractAt(
    "contracts/interfaces/IDiamondCut.sol:IDiamondCut", 
    diamondAddress
  );

  const selectors = [
    ethers.id("getHumanCount()").substring(0, 10),
    ethers.id("getHumanPower(uint256)").substring(0, 10)
  ];

  console.log("--- ⚔️ Performing Manual Diamond Cut ---");
  
  // Action 0 = Add, Action 1 = Replace
  // If you get a 'selector already exists' error, change action to 1
  const cut = [{
    facetAddress: facetAddress,
    action: 0, 
    functionSelectors: selectors
  }];

  try {
    const tx = await diamondCut.diamondCut(cut, ethers.ZeroAddress, "0x");
    await tx.wait();
    console.log("✨ SUCCESS: Selectors inscribed into the Stone.");
  } catch (error) {
    if (error.message.includes("LibDiamond: Add facet already exists")) {
       console.log("🔄 Selectors already exist. Retrying with REPLACE action...");
       const replaceCut = [{
         facetAddress: facetAddress,
         action: 1, 
         functionSelectors: selectors
       }];
       const tx = await diamondCut.diamondCut(replaceCut, ethers.ZeroAddress, "0x");
       await tx.wait();
       console.log("✨ SUCCESS: Selectors REPLACED in the Stone.");
    } else {
       console.error("Cut Failed:", error.message);
    }
  }
}

main().catch(console.error);
