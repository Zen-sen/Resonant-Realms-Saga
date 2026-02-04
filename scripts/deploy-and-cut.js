const { ethers } = require("hardhat");

async function main() {
  const diamondAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const [deployer] = await ethers.getSigners();

  console.log("--- Initiating The Great Cut (Explicit Mode) ---");

  const FacetNames = ["DiamondLoupeFacet", "HumanFactoryFacet"];
  const cut = [];

  for (const name of FacetNames) {
    const Facet = await ethers.getContractFactory(name);
    const facet = await Facet.deploy();
    await facet.waitForDeployment();
    const facetAddress = await facet.getAddress();
    console.log(`Deployed ${name} at: ${facetAddress}`);

    const contractInterface = Facet.interface;
    const selectors = [];
    contractInterface.forEachFunction((fragment) => {
      selectors.push(fragment.selector);
    });

    cut.push({
      facetAddress: facetAddress,
      action: 0, 
      functionSelectors: selectors,
    });
  }

  // FIXED: Using the fully qualified name to resolve ambiguity
  const diamondCut = await ethers.getContractAt(
    "contracts/interfaces/IDiamondCut.sol:IDiamondCut", 
    diamondAddress
  );

  const tx = await diamondCut.diamondCut(cut, ethers.ZeroAddress, "0x");
  await tx.wait();

  console.log("--- Diamond Successfully Initialized ---");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
