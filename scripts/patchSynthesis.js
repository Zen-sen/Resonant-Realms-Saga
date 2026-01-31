const { ethers } = require("hardhat");

async function main() {
  const DIAMOND_ADDRESS = "0x8198f5d8F8CfFE8f9C413d98a0A55aEB8ab9FbB7";
  const heritageAddress = "0x51A1ceB83B83F1985a81C295d1fF28Afef186E02"; 

  console.log("🩹 Patching the Stone with the Synthesis Bridge...");

  const stone = await ethers.getContractAt("Diamond", DIAMOND_ADDRESS);
  const Heritage = await ethers.getContractFactory("AncestralHeritageFacet");

  const selector = Heritage.interface.getFunction("selectSynthesisBuff").selector;
  console.log("Registering Selector:", selector);

  const tx = await stone.setFacetsBatch(heritageAddress, [selector]);
  await tx.wait();

  console.log("✨ SUCCESS: The Synthesis Bridge is now inscribed in the Stone.");
}

main().catch(console.error);
