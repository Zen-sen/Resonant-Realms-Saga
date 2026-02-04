const { ethers } = require("hardhat");

async function main() {
  const DIAMOND_ADDRESS = "0x8198f5d8F8CfFE8f9C413d98a0A55aEB8ab9FbB7";
  
  console.log("🏺 Patching Factory Facet with Power Sensing...");
  const Factory = await ethers.getContractFactory("HumanFactoryFacet");
  const factory = await Factory.deploy();
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  
  const stone = await ethers.getContractAt("Diamond", DIAMOND_ADDRESS);
  
  // We MUST include the new selector here
  const selectors = [
    Factory.interface.getFunction("mintGenesisHuman").selector,
    Factory.interface.getFunction("mintNextGeneration").selector,
    Factory.interface.getFunction("getHuman").selector,
    Factory.interface.getFunction("getHumanPower").selector // THE MISSING KEY
  ];

  await stone.setFacetsBatch(factoryAddress, selectors);
  console.log("✨ SUCCESS: Human Factory Patched at:", factoryAddress);
}

main().catch(console.error);
