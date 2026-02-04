const { ethers } = require("hardhat");

async function main() {
  const diamondAddress = "0x525C7063E7C20997BaaE9bDa922159152D0e8417";
  const [deployer] = await ethers.getSigners();

  console.log("--- Initiating Surgical Cut (Fully Qualified) ---");

  // 1. Deploy the new logic
  const HumanFactoryFacet = await ethers.getContractFactory("HumanFactoryFacet");
  const facet = await HumanFactoryFacet.deploy();
  await facet.waitForDeployment();
  const facetAddress = await facet.getAddress();
  
  // 2. Get the new selector
  const newSelector = HumanFactoryFacet.interface.getFunction("mintGenesisHuman(uint256)").selector;

  // 3. Perform the Cut using the Fully Qualified Name
  const diamondCut = await ethers.getContractAt(
    "contracts/interfaces/IDiamondCut.sol:IDiamondCut", 
    diamondAddress
  );
  
  const tx = await diamondCut.diamondCut(
    [{
      facetAddress: facetAddress,
      action: 0, // Add
      functionSelectors: [newSelector]
    }],
    ethers.ZeroAddress,
    "0x"
  );
  await tx.wait();

  console.log("New Selector Inscribed: ", newSelector);
  console.log("The Stone is now ready for Tribal DNA.");
}

main().catch(console.error);
