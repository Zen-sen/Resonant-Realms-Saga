const { ethers } = require("hardhat");

async function main() {
  const DIAMOND_ADDRESS = "0x9A676e781A523b5d0C0e43731313A708CB607508";
  
  console.log("⚒️ Manifesting the Bunny Factory...");
  const Factory = await ethers.getContractFactory("BunnyFactoryFacet");
  const factory = await Factory.deploy();
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();

  console.log("🏺 Factory Facet deployed at:", factoryAddress);

  // FIXED: Using fully qualified name to resolve the HH701 conflict
  // We use the one that contains your custom logic
  const stone = await ethers.getContractAt("contracts/interfaces/IDiamondCut.sol:IDiamondCut", DIAMOND_ADDRESS);

  const selectors = [
    factory.interface.getFunction("mintGenesisBunny").selector,
    factory.interface.getFunction("getBunny").selector
  ];

  console.log("⚔️ Using setFacetsBatch to inscribe the Factory...");
  
  try {
    // Attempting your custom inscription method first
    const tx = await stone.setFacetsBatch(factoryAddress, selectors);
    await tx.wait();
    console.log("✨ SUCCESS: The Factory is now part of the Stone via setFacetsBatch.");
  } catch (err) {
    console.log("⚠️ setFacetsBatch not found or failed, trying standard diamondCut...");
    
    const cut = [{
      facetAddress: factoryAddress,
      action: 0, // Add
      functionSelectors: selectors
    }];

    try {
      const tx = await stone.diamondCut(cut, ethers.ZeroAddress, "0x");
      await tx.wait();
      console.log("✨ SUCCESS: The Factory is now part of the Stone via diamondCut.");
    } catch (innerErr) {
      console.error("❌ Both inscription methods failed. Is the Stone's gateway locked?");
      console.error("Error Detail:", innerErr.message);
    }
  }
}

main().catch(console.error);
