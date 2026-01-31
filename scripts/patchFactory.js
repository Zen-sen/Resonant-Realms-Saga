const { ethers } = require("hardhat");

async function main() {
  const DIAMOND_ADDRESS = "0x8198f5d8F8CfFE8f9C413d98a0A55aEB8ab9FbB7";
  
  const Factory = await ethers.getContractFactory("BunnyFactoryFacet");
  const factory = await Factory.deploy();
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  
  const stone = await ethers.getContractAt("Diamond", DIAMOND_ADDRESS);
  const selector = Factory.interface.getFunction("mintNextGeneration").selector;

  await stone.setFacetsBatch(factoryAddress, [selector]);
  console.log("✨ Bunny Factory Updated. Next Gen Minting Active at:", factoryAddress);
}

main().catch(console.error);
