const { ethers } = require("hardhat");

async function main() {
  const diamondAddress = "0x525C7063E7C20997BaaE9bDa922159152D0e8417";
  const [deployer] = await ethers.getSigners();

  // 1. Get the new Facet instance
  const HumanFactoryFacet = await ethers.getContractFactory("HumanFactoryFacet");
  const facet = await HumanFactoryFacet.deploy();
  await facet.waitForDeployment();
  const facetAddress = await facet.getAddress();

  console.log("New HumanFactoryFacet deployed to:", facetAddress);

  // 2. Prepare the Diamond Cut
  // We need to replace the mintGenesisHuman selector
  const selectors = ["0x498e79e6"]; // This is the old mintGenesisHuman() selector
  // Note: For simplicity in this local dev environment, 
  // we usually just re-run the deployment or use a Loupe to find all selectors.
  
  // Alternative: Use the DiamondCutFacet to ADD the new selector
  const diamondCut = await ethers.getContractAt("IDiamondCut", diamondAddress);
  
  const newSelectors = [
    HumanFactoryFacet.interface.getFunction("mintGenesisHuman").selector
  ];

  console.log("Inscribing new selector:", newSelectors[0]);

  const tx = await diamondCut.diamondCut(
    [{
      facetAddress: facetAddress,
      action: 0, // Add (or 1 for Replace if it already exists)
      functionSelectors: newSelectors
    }],
    ethers.ZeroAddress,
    "0x"
  );
  await tx.wait();

  console.log("Diamond Stone updated with Genetic Spark.");
}

main().catch(console.error);
